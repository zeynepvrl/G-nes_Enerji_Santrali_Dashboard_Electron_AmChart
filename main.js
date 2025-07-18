const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { Pool } = require('pg')
const sql = require('mssql')
const isDev = process.argv.includes('--dev')
const { autoUpdater } = require('electron-updater')
const { dialog } = require('electron');
const log = require('electron-log');
const cron = require('node-cron');
const workerManager = require('./workers/worker-manager');

let mainWindow;
let dbPool;
let mqttClient;

// Güncelleme loglarını yazdırmak için
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
// Hangi kanal kullanılacak (opsiyonel)
autoUpdater.channel = 'latest';

//const MAX_DB_RETRIES = 5; // Maksimum deneme sayısı
const DB_RETRY_DELAY_MS = 600000; // 10 dakika (milisaniye)f

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
    autoHideMenuBar: true,
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

//postgre
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
    database: 'facility_info', 
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

ipcMain.handle('get-ges-info', async () => {
  if(!facilityPool){
    console.error("❌ facility_info bağlantısı yok.");
    return [];
  }
  try{
    const result =await facilityPool.query('SELECT name, latitude, longitude, district from limits')
    return result.rows;
  }catch(error){
    console.error("❌ facility_info geses sorgusu hatası:", error.message);
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

// Tablo isimlerini veya son kayıtları getiren IPC handler - Worker kullanarak
ipcMain.handle('get-tables-history', async (event, dbName, tableName, limit, startTime, endTime) => {
  console.log("get-tables-history",dbName, tableName, limit, startTime, endTime);
  try {
    const result = await workerManager.sendMessage('database', {
      type: 'get-tables',
      data: { dbName, tableName, limit, startTime, endTime }
    });
    //console.log('✅ get-tables result length:', result?.length || 0);
    return result;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw new Error(`Database query failed: ${error.message}`);
  }
});

// Tüm veritabanları için handler - Worker kullanarak
ipcMain.handle('get_all_GESdbs_and_their_tables_for_dropdowns', async () => {
  //console.log('🔍 get_all_GESdbs_and_their_tables_for_dropdowns called');
  try {
    const result = await workerManager.sendMessage('database', {
      type: 'get-all-GESdbs-and-their-tables-for-dropdowns'
    });
    //console.log('✅ get_all_GESdbs result keys:', Object.keys(result || {}));
    return result;
  } catch (error) {
    console.error('❌ Error fetching database list:', error);
    throw new Error(`Failed to fetch database list: ${error.message}`);
  }
});

let subscribedTopics = new Set();

ipcMain.handle('subscribe-mqtt', async (event, topic) => {
  if (!mqttClient || subscribedTopics.has(topic)) return;

  return new Promise((resolve, reject) => {
    mqttClient.subscribe(topic, (err) => {
      if (err) {
        console.error('MQTT subscribe error:', err);
        reject(err);
        return;
      }
      subscribedTopics.add(topic);
      console.log('MQTT subscribed:', topic);
      resolve();
    });
  });
});

ipcMain.handle('unsubscribe-mqtt', async (event, topic) => {
  if (!mqttClient || !subscribedTopics.has(topic)) return;
  return new Promise((resolve, reject) => {
    mqttClient.unsubscribe(topic, (err) => {
      if (err) {
        console.error('MQTT unsubscribe error:', err);
        reject(err);
        return;
      }
      subscribedTopics.delete(topic);
      console.log('MQTT unsubscribed:', topic);
      resolve();
    });
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

// Uygulama kapatılırken worker'ları da kapat
app.on('window-all-closed', async () => {
  console.log('🔄 Application closing, cleaning up resources...');
  
  if (dbPool) {
    console.log('🔌 Closing database pool...');
    dbPool.end();
  }
  
  // Worker'ları kapat
  console.log('🔌 Terminating all workers...');
  await workerManager.terminateAll();
  
  // MQTT bağlantısını kapat
  if (mqttClient) {
    console.log('🔌 Closing MQTT connection...');
    mqttClient.end();
  }
  
  console.log('✅ All resources cleaned up');
  
  if (process.platform !== 'darwin') {
    app.quit()
  }
})



// MSSQL tabloları için handler - Worker kullanarak
ipcMain.handle('get-mssql-tables', async () => {
  //console.log('🔍 get-mssql-tables called');
  try {
    const result = await workerManager.sendMessage('database', {
      type: 'get-mssql-tables'
    });
    //console.log("get-mssql-tables result:",result);
    return result;
  } catch (error) {
    console.error("❌ MSSQL sorgu hatası:", error.message);
    return [];
  }
});

ipcMain.handle('log-to-outage', async (event, outages) => {
  if (!globalPool) {
    console.error("❌ MSSQL bağlantısı yok. Kesinti logu eklenemedi.");
    return;
  }

  try {
    console.log("outages",outages);
    const o = outages[0];
    
    console.log(o.name,o.WERT,o.DATUMZEIT,Number(o.ID),o.STATUS);
    // veya for ile her biri için
    await globalPool.request()
    .input('NAME',o.name)
    .input('WERT',o.WERT)
    .input('DATUMZEIT',o.DATUMZEIT)
    .input('ID',Number(o.ID))
    .input('STATUS',o.STATUS)
    .query(`INSERT INTO dbo.OUTAGES (NAME, WERT, DATUMZEIT,ID,STATUS) VALUES (@NAME, @WERT,@DATUMZEIT,@ID,@STATUS)`);
    console.log("✅ Kesinti logu başarıyla eklendi.");
  } catch (err) {
    console.error("❌ Kesinti logu eklenirken hata:", err.message);
  }
});

// MQTT veri işleme için yeni handler
ipcMain.handle('process-mqtt-data', async (event, rawData, variableConfig) => {
  //console.log('🔍 process-mqtt-data called with:', { rawData: rawData.substring(0, 100) + '...', variableConfig });
  try {
    const result = await workerManager.sendMessage('mqtt', {
      type: 'process-mqtt-data',
      data: { rawData, variableConfig }
    });
    //console.log('✅ process-mqtt-data result:', result);
    return result;
  } catch (error) {
    console.error('❌ MQTT processing error:', error);
    return null;
  }
});

// Chart veri işleme için yeni handler
ipcMain.handle('get-chart-data', async (event, data) => {
  //console.log('🔍 get-chart-data called with:', { dataLength: data?.data?.length, timeUnit: data?.timeUnit, chartType: data?.chartType });
  try {
    const result = await workerManager.sendMessage('mqtt', {
      type: 'get-chart-data',
      data
    });
    //console.log('✅ get-chart-data result length:', result?.length || 0);
    return result;
  } catch (error) {
    console.error('❌ Chart data processing error:', error);
    return [];
  }
});

autoUpdater.on('update-available', (info) => {
  //console.log('Yeni güncelleme mevcut:', info.version);
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
  //console.log(`İndirilen: ${progressObj.percent.toFixed(2)}%`);
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