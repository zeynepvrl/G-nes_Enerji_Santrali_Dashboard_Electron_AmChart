const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const mqtt = require('mqtt')
const { Pool } = require('pg')
const sql = require('mssql')
const isDev = process.argv.includes('--dev')
const { autoUpdater } = require('electron-updater')
const { dialog } = require('electron');
const log = require('electron-log');
const cron = require('node-cron');

let mainWindow;
let dbPool;
let mqttClient;
let currentSubscribedTopic = null;

// Güncelleme loglarını yazdırmak için
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
// Hangi kanal kullanılacak (opsiyonel)
autoUpdater.channel = 'latest';

//const MAX_DB_RETRIES = 5; // Maksimum deneme sayısı
const DB_RETRY_DELAY_MS = 600000; // 10 dakika (milisaniye)

// MSSQL bağlantı konfigürasyonu
const mssqlConfig = {
    server: '192.168.234.3\\prod19',
    database: 'ZENON',
    user: 'zenon',
    password: 'zeN&N-8QL*',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

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

let facilityPool;

function setupFacilityDatabase() {
  facilityPool = new Pool({
    user: 'zeynep',
    host: '10.10.30.31',
    database: 'facility_info', // 🔥 Doğru veritabanı
    password: 'zeynep421',
    port: 5432,
  });

  facilityPool.on('error', (err) => {
    console.error('❌ facility_info bağlantı hatası:', err.message);
  });

  facilityPool.connect()
    .then(() => console.log('✅ facility_info bağlantısı başarılı'))
    .catch(err => console.error('❌ facility_info bağlantısı başarısız:', err.message));
}

ipcMain.handle('get-limits', async () => {
  if (!facilityPool) {
    console.error("⚠ facility_info bağlantısı yok.");
    return [];
  }

  try {
    const result = await facilityPool.query('SELECT name, limit_value FROM limits');
    return result.rows;
  } catch (error) {
    console.error("❌ facility_info limits sorgusu hatası:", error.message);
    return [];
  }
});

ipcMain.handle('update-limit', async (event, name, newLimit) => {
  if (!facilityPool) {
    console.error("⚠ facility_info bağlantısı yok.");
    return { success: false, error: "Veritabanı bağlantısı yok" };
  }

  try {
    await facilityPool.query(
      `UPDATE limits SET limit_value = $1 WHERE name = $2`,
      [newLimit, name]
    );
    console.log(`✅ Limit güncellendi: ${name} => ${newLimit}`);
    return { success: true };
  } catch (err) {
    console.error("❌ LIMIT güncelleme hatası:", err.message);
    return { success: false, error: err.message };
  }
});

// Örnek: Her gün saat 00 00'de çalışsın
cron.schedule('0 0 * * *', async () => {
  console.log("🕒 ENERGY tablosu silme denemesi - zamanlayıcı çalıştı");
  if (!globalPool) {
    console.error("❌ MSSQL bağlantısı yok. ENERGY tablosu silinemedi.");
    return;
  }

  try {
    await globalPool.request().query(`DELETE FROM dbo.ENERGY`);
    console.log("✅ ENERGY tablosu test amacıyla başarıyla silindi.");
  } catch (err) {
    console.error("❌ ENERGY tablosu silinirken hata:", err.message);
  }
});

// Tablo isimlerini veya son kayıtları getiren IPC handler
ipcMain.handle('get-tables', async (event, dbName, tableName, limit, startTime, endTime) => {
  // Veritabanı bağlantı bilgilerini config'den al
  const dbConfig = {
    user: process.env.DB_USER || 'zeynep',
    host: process.env.DB_HOST || '10.10.30.31',
    database: dbName,
    password: process.env.DB_PASSWORD || 'zeynep421',
    port: parseInt(process.env.DB_PORT || '5432'),
  };

  let tempPool;
  try {
    // Table name validation
    if (!tableName || !/^[a-zA-Z0-9_]+$/.test(tableName)) {
      throw new Error('Invalid table name');
    }

    tempPool = new Pool(dbConfig);

    // Build query safely
    let query = `
      SELECT *
      FROM "${tableName}"
    `;
    const params = [];
    let whereClauses = [];

    // Add time range conditions
    if (startTime && endTime) {
      whereClauses.push(`timestamp BETWEEN $1 AND $2`);
      params.push(startTime, endTime);
    } else if (startTime) {
      whereClauses.push(`timestamp >= $1`);
      params.push(startTime);
    } else if (endTime) {
      whereClauses.push(`timestamp <= $1`);
      params.push(endTime);
    }

    if (whereClauses.length > 0) {
      query += ' WHERE ' + whereClauses.join(' AND ');
    }

    // Add ordering and limit
    if (!startTime && !endTime) {
      query += ` ORDER BY timestamp DESC LIMIT $${params.length + 1}`;
      params.push(limit || 1000);
    } else {
      query += ` ORDER BY timestamp ASC`;
      if (limit) {
        query += ` LIMIT $${params.length + 1}`;
        params.push(limit);
      }
    }

    //console.log('Executing query:', query);
    //console.log('With params:', params);

    const result = await tempPool.query(query, params);
    
    // Veri doğrulama ve dönüştürme
    const validatedRows = result.rows.map(row => {
      // timestamp kontrolü
      if (!row.timestamp) {
        console.warn('Row missing timestamp:', row);
        return null;
      }
      
      // timestamp'i Date objesine çevir
      const timestamp = new Date(row.timestamp);
      if (isNaN(timestamp.getTime())) {
        console.warn('Invalid timestamp:', row.timestamp);
        return null;
      }
      
      return {
        ...row,
        timestamp: timestamp
      };
    }).filter(row => row !== null);

    return validatedRows;

  } catch (error) {
    console.error('Database query error:', error);
    throw new Error(`Database query failed: ${error.message}`);
  } finally {
    if (tempPool) {
      try {
        await tempPool.end();
      } catch (error) {
        console.error('Error closing database connection:', error);
      }
    }
  }
});

// Tüm veritabanları için handler
ipcMain.handle('get-all-tables', async () => {
  const pool = new Pool({
    user: process.env.DB_USER || 'zeynep',
    host: process.env.DB_HOST || '10.10.30.31',
    database: 'postgres',
    password: process.env.DB_PASSWORD || 'zeynep421',
    port: parseInt(process.env.DB_PORT || '5432'),
  });

  try {
    const dbs = await pool.query("SELECT datname FROM pg_database WHERE datistemplate = false;");
    const result = {};
    
    for (const row of dbs.rows) {
      const dbName = row.datname;
      const tempPool = new Pool({
        user: process.env.DB_USER || 'zeynep',
        host: process.env.DB_HOST || '10.10.30.31',
        database: dbName,
        password: process.env.DB_PASSWORD || 'zeynep421',
        port: parseInt(process.env.DB_PORT || '5432'),
      });
      
      try {
        const tables = await tempPool.query(
          "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
        );
        result[dbName] = tables.rows.map(r => r.table_name);
      } catch (e) {
        console.error(`Database connection error for ${dbName}:`, e);
        result[dbName] = [];
      } finally {
        await tempPool.end();
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching database list:', error);
    throw new Error(`Failed to fetch database list: ${error.message}`);
  } finally {
    await pool.end();
  }
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

let globalPool; // 🌐 Bağlantı havuzu

async function initSqlConnection() {
  if (!globalPool) {
    try {
      globalPool = await sql.connect(mssqlConfig);
      console.log("✅ MSSQL bağlantısı kuruldu");
    } catch (err) {
      console.error("❌ MSSQL bağlantısı kurulamadı:", err);
    }
  }
}

app.whenReady().then(async () => {
  await initSqlConnection();
  // diğer başlangıç fonksiyonları
});

ipcMain.handle('get-mssql-tables', async () => {
  if (!globalPool) {
    console.error("⚠ MSSQL bağlantısı yok");
    return [];
  }

  try {
    const result = await globalPool
      .request()
      .query(`
        SELECT
          vars.NAME,
          latest.WERT,
          CONVERT(VARCHAR(19), latest.DATUMZEIT, 120) AS DATUMZEIT
        FROM
          (SELECT DISTINCT NAME FROM dbo.ENERGY) AS vars
          OUTER APPLY (
            SELECT TOP 1 WERT, DATUMZEIT
            FROM dbo.ENERGY
            WHERE NAME = vars.NAME
            ORDER BY DATUMZEIT DESC
          ) AS latest
      `);
      
   
    const measurements = result.recordset.map(row => ({
      name: row.NAME,
      WERT: Math.abs(Number(row.WERT)),
      DATUMZEIT:row.DATUMZEIT,
    }));
    console.log("measurements", measurements.length);
    return measurements;

  } catch (error) {
    console.error("❌ MSSQL sorgu hatası:", error.message);
    return [];
  }
});

autoUpdater.on('update-available', (info) => {
  console.log('Yeni güncelleme mevcut:', info.version);
  dialog.showMessageBox({
    type: 'info',
    title: 'Güncelleme Kontrolü',
    message: `Yeni bir sürüm (${info.version}) bulundu. İndiriliyor...`,
  });
});

autoUpdater.on('error', (err) => {
  console.error('Güncelleme sırasında hata:', err);
});

autoUpdater.on('download-progress', (progressObj) => {
  console.log(`İndirilen: ${progressObj.percent.toFixed(2)}%`);
});

autoUpdater.on('update-downloaded', (info) => {
  const result = dialog.showMessageBoxSync({
    type: 'question',
    buttons: ['Yeniden Başlat', 'Daha Sonra'],
    defaultId: 0,
    message: 'Güncelleme indirildi. Uygulama şimdi yeniden başlatılsın mı?',
  });

  if (result === 0) {
    autoUpdater.quitAndInstall(); // Uygulama kapanır ve yeni sürümle yeniden açılır
  }
});

app.whenReady().then(() => {
  createWindow()
  setupMqtt()
  setupDatabase()
  setupFacilityDatabase(); 
  autoUpdater.checkForUpdatesAndNotify();           //Kullanıcı uygulamayı açtığında güncelleme var mı diye kontrol eder ve varsa indirip yükler.

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

/* package.json içinde version numarasını artır,

Tekrar npm run build,

Yeni release oluştur ve dosyaları yükle. */