const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const mqtt = require('mqtt')
const { Pool } = require('pg')
const isDev = process.argv.includes('--dev')

let mainWindow;
let dbPool;
let mqttClient;
let currentSubscribedTopic = null;

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
    console.log('MQTT mesajı geldi:', topic, message.toString());
    if (mainWindow) {
      mainWindow.webContents.send('mqtt-data', message.toString(), topic);
    }
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
  });

  // Bağlantıyı test et
  dbPool.connect((err, client, release) => {
    if (err) {
      console.error('Veritabanı bağlantı hatası:', err);
      return;
    }
    console.log('PostgreSQL veritabanına başarıyla bağlandı!');
    release();
  });
}

// IPC olayları için veritabanı işlemleri
ipcMain.handle('get-databases', async () => {
  try {
    const result = await dbPool.query('SELECT datname FROM pg_database WHERE datistemplate = false;');
    return result.rows;
  } catch (error) {
    console.error('Veritabanları listelenirken hata:', error);
    throw error;
  }
});

// Tablo isimlerini getiren IPC handler
ipcMain.handle('get-tables', async (event, dbName) => {
  const tempPool = new Pool({
    user: 'zeynep',
    host: '10.10.30.31',
    database: dbName,
    password: 'zeynep421',
    port: 5432,
  });
  try {
    const result = await tempPool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);
    await tempPool.end();
    return result.rows.map(row => row.table_name);
  } catch (error) {
    await tempPool.end();
    throw error;
  }
});

// Tüm veritabanları için tablo isimlerini başta çeken handler
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
  if (currentSubscribedTopic) {
    mqttClient.unsubscribe(currentSubscribedTopic, () => {
      console.log('MQTT unsubscribed:', currentSubscribedTopic);
    });
  }
  currentSubscribedTopic = topic;
  mqttClient.subscribe(topic, () => {
    console.log('MQTT subscribed:', topic);
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