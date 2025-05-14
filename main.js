const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const mqtt = require('mqtt')
const { Pool } = require('pg')
const isDev = process.argv.includes('--dev')

let mainWindow;
let dbPool;
let mqttClient;
let currentSubscribedTopic = null;

//const MAX_DB_RETRIES = 5; // Maksimum deneme sayısı
const DB_RETRY_DELAY_MS = 600000; // 10 dakika (milisaniye)

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: !isDev
    }
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'))
    mainWindow.webContents.openDevTools()
  }

  // F12 ile geliştirici araçlarını aç
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' && input.type === 'keyDown') {
      mainWindow.webContents.openDevTools();
    }
  });
}

function setupMqtt() {
  mqttClient = require('mqtt').connect('mqtts://10.10.15.222:1883', {
    username: 'zeynep',
    password: 'zeynep421',
    rejectUnauthorized: false
  });

  mqttClient.on('connect', () => {
    console.log('MQTT bağlandı!');
  });

  mqttClient.on('error', (err) => {
    console.error('MQTT bağlantı hatası:', err);
  });

  mqttClient.on('message', (topic, message) => {
    //console.log('MQTT mesajı geldi:', topic, message.toString());
    if (mainWindow) {
      mainWindow.webContents.send('mqtt-data', message.toString(), topic);
    }
  });
}

function attemptInitialConnection() {
  if (!dbPool) {
    console.error("dbPool başlatılmamış. attemptInitialConnection çağrılmadan önce setupDatabase içinde başlatılmalı.");
    return;
  }
  console.log(`Veritabanına bağlanma denemesi...`);

  dbPool.connect((err, client, done) => {
    if (err) {
      console.error('Veritabanı bağlantı testi hatası:', err.message);
      if (done) {
        done(err); // Havuza istemciyle ilgili bir sorun olduğunu bildir
      }
      console.log(`${DB_RETRY_DELAY_MS / 60000} dakika içinde yeniden denenecek...`);
      setTimeout(() => attemptInitialConnection(), DB_RETRY_DELAY_MS);
      return;
    }

    console.log('PostgreSQL veritabanına test bağlantısı başarıyla kuruldu!');
    if (done) {
      done(); // İstemciyi havuza geri bırak
    }
    // İsteğe bağlı: Renderer process'e başarılı bağlantı bildirilebilir
    // if (mainWindow) {
    //   mainWindow.webContents.send('db-connection-status', { connected: true });
    // }
  });
}

// PostgreSQL bağlantı havuzu oluşturma
function setupDatabase() {
  dbPool = new Pool({
    user: 'zeynep',
    host: '10.10.30.31',
    database: 'postgres',
    password: 'zeynep421',
    port: 5432,
    // Önerilen ayarlar:
    // connectionTimeoutMillis: 5000, // Bağlantı zaman aşımı (ms)
    // idleTimeoutMillis: 10000,      // Boştaki istemci zaman aşımı (ms)
    // max: 10,                       // Havuzdaki maksimum istemci sayısı
  });

  // Havuzda oluşabilecek genel hataları dinlemek için
  dbPool.on('error', (error, client) => {
    console.error('Veritabanı havuzunda beklenmedik hata:', error.message);
    // Bu olay, havuzdan kiralanan bir istemci boşa düştüğünde
    // ve bir hata yaydığında tetiklenir.
  });
  
  // Bağlantıyı test etme ve doğrulama denemesini başlat
  attemptInitialConnection();
}


// Tablo isimlerini veya son kayıtları getiren IPC handler
ipcMain.handle('get-tables', async (event, dbName, tableName, limit, startDate, endDate) => {
  const tempPool = new Pool({
    user: 'zeynep',
    host: '10.10.30.31',
    database: dbName,
    password: 'zeynep421',
    port: 5432,
  });

  try {
    let query = `
      SELECT *
      FROM "${tableName}"
    `;
    const params = [];

    // Tarih aralığı varsa ekle
    if (startDate && endDate) {
      query += ` WHERE timestamp BETWEEN $1 AND $2`;
      params.push(startDate, endDate);
    }

    query += ` ORDER BY timestamp DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await tempPool.query(query, params);
    await tempPool.end();
    //console.log('result:', result.rows);
    return result.rows;
  } catch (error) {
    await tempPool.end();
    throw error;
  }
});

// Tüm veritabanları içinr
ipcMain.handle('get-all-tables', async () => {
  const pool = new Pool({
    user: 'zeynep',
    host: '10.10.30.31',
    database: 'postgres',
    password: 'zeynep421',
    port: 5432,
  });
  const dbs = await pool.query("SELECT datname FROM pg_database WHERE datistemplate = false;");
  const result = {};
  for (const row of dbs.rows) {
    const dbName = row.datname;
    const tempPool = new Pool({
      user: 'zeynep',
      host: '10.10.30.31',
      database: dbName,
      password: 'zeynep421',
      port: 5432,
    });
    try {
      const tables = await tempPool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
      result[dbName] = tables.rows.map(r => r.table_name);
      //console.log(result);
    } catch (e) {
      console.error('Veritabanı bağlantı hatası:', e);
      result[dbName] = [];
    }
    await tempPool.end();
  }
  await pool.end();
  return result;
});

// Dinamik subscribe için IPC handler
ipcMain.handle('subscribe-mqtt', async (event, topic) => {
  if (!mqttClient) return;
  
  return new Promise((resolve, reject) => {
    if (currentSubscribedTopic) {
      mqttClient.unsubscribe(currentSubscribedTopic, (err) => {
        if (err) {
          console.error('MQTT unsubscribe error:', err);
          reject(err);
          return;
        }
        console.log('MQTT unsubscribed:', currentSubscribedTopic);
        
        // Unsubscribe başarılı olduktan sonra yeni topic'e subscribe ol
        currentSubscribedTopic = topic;
        mqttClient.subscribe(topic, (err) => {
          if (err) {
            console.error('MQTT subscribe error:', err);
            reject(err);
            return;
          }
          console.log('MQTT subscribed:', topic);
          resolve();
        });
      });
    } else {
      // Eğer önceden subscribe olunmuş topic yoksa direkt yeni topic'e subscribe ol
      currentSubscribedTopic = topic;
      mqttClient.subscribe(topic, (err) => {
        if (err) {
          console.error('MQTT subscribe error:', err);
          reject(err);
          return;
        }
        console.log('MQTT subscribed:', topic);
        resolve();
      });
    }
  });
});

app.whenReady().then(() => {
  createWindow()
  setupMqtt()
  setupDatabase()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Uygulama kapatılırken veritabanı bağlantısını kapat
app.on('window-all-closed', () => {
  if (dbPool) {
    dbPool.end();
  }
  if (process.platform !== 'darwin') {
    app.quit()
  }
}) 