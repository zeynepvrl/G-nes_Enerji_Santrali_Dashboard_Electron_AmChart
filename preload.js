const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onMqttData: (callback) => {
    const listener = (event, data, topic) => callback(data, topic);
    ipcRenderer.on('mqtt-data', listener);
    // Unsubscribe fonksiyonu döndür
    return () => ipcRenderer.removeListener('mqtt-data', listener);
  },
  getLimits: () => ipcRenderer.invoke('get-limits'),
  updateLimit: (name, newLimit) => ipcRenderer.invoke('update-limit', name, newLimit),
  getTablesHistory: (dbName, tableName, limit, startTime, endTime) => ipcRenderer.invoke('get-tables-history', dbName, tableName, limit, startTime, endTime),
  getAllGESdbsAndTheirTablesForDropdowns: () => ipcRenderer.invoke('get_all_GESdbs_and_their_tables_for_dropdowns'),
  subscribeMqtt: (topic) => ipcRenderer.invoke('subscribe-mqtt', topic),
  getMssqlTables: () => ipcRenderer.invoke('get-mssql-tables'),
  unsubscribeMqtt: (topic) => ipcRenderer.invoke('unsubscribe-mqtt', topic),
  
  // Yeni worker-based API'ler
  processMqttData: (rawData, variableConfig) => ipcRenderer.invoke('process-mqtt-data', rawData, variableConfig),
  getChartData: (data) => ipcRenderer.invoke('get-chart-data', data),
}); 


/*  kod parçası, Electron uygulamalarında main process (arka plan) ile renderer process (arayüz) arasında güvenli 
ve kontrollü bir iletişim sağlamak için kullanılır. */