const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onMqttData: (callback) => {
    const listener = (event, data, topic) => callback(data, topic);
    ipcRenderer.on('mqtt-data', listener);
    // Unsubscribe fonksiyonu döndür
    return () => ipcRenderer.removeListener('mqtt-data', listener);
  },
  getTablesHistory: (dbName, tableName, limit, startTime, endTime) => ipcRenderer.invoke('get-tables', dbName, tableName, limit, startTime, endTime),
  getAllTables: () => ipcRenderer.invoke('get-all-tables'),
  subscribeMqtt: (topic) => ipcRenderer.invoke('subscribe-mqtt', topic)
}); 


/*  kod parçası, Electron uygulamalarında main process (arka plan) ile renderer process (arayüz) arasında güvenli 
ve kontrollü bir iletişim sağlamak için kullanılır. */