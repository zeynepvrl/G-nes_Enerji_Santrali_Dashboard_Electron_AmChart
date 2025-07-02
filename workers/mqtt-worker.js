const { parentPort } = require('worker_threads');

// MQTT veri işleme fonksiyonları
class MqttDataProcessor {
  constructor() {
    this.dataBuffer = [];
    this.maxBufferSize = 1000; // Maksimum buffer boyutu
  }

  // MQTT verisini parse et ve işle
  processMqttData(rawData, variableConfig) {
    try {
      const parsedData = JSON.parse(rawData);
      if (!Array.isArray(parsedData)) return null;
      
      const variableIndex = variableConfig.index;
      if (variableIndex === undefined) return null;
      
      const value = parsedData[variableIndex + 1];
      if (value === undefined) return null;

      const timestamp = new Date(parsedData[0]).getTime();
      
      return {
        timestamp,
        value: Number(value),
        raw: parsedData
      };
    } catch (error) {
      console.error('MQTT data parsing error:', error);
      return null;
    }
  }

  // Veri buffer'ını yönet
  addToBuffer(data) {
    this.dataBuffer.push(data);
    
    // Buffer boyutunu kontrol et
    if (this.dataBuffer.length > this.maxBufferSize) {
      this.dataBuffer = this.dataBuffer.slice(-this.maxBufferSize);
    }
  }

  // Belirli bir zaman aralığındaki verileri getir
  getDataInTimeRange(startTime, endTime) {
    return this.dataBuffer.filter(data => 
      data.timestamp >= startTime && data.timestamp <= endTime
    );
  }

  // Son N veriyi getir
  getLastNRecords(n) {
    return this.dataBuffer.slice(-n);
  }

  // Buffer'ı temizle
  clearBuffer() {
    this.dataBuffer = [];
  }

  // İstatistikleri hesapla
  calculateStats() {
    if (this.dataBuffer.length === 0) return null;
    
    const values = this.dataBuffer.map(d => d.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    return {
      count: values.length,
      average: avg,
      min,
      max,
      sum
    };
  }
}

// Chart veri işleme fonksiyonları
class ChartDataProcessor {
  // Zaman aralığına göre veri gruplandırma
  groupDataByTimeInterval(data, timeUnit, count) {
    if (!data || data.length === 0) {
      return [];
    }

    const ms = timeUnit === "minute" ? count * 60000 : count * 3600000;
    const grouped = new Map();
    
    //console.log(`🕒 Grouping data by interval:`, { dataCount: data.length, timeUnit, count, intervalMs: ms });
    //console.log(`🕒 First data point:`, { timestamp: data[0].timestamp, value: data[0].value, date: new Date(data[0].timestamp) });

    data.forEach(item => {
      if (typeof item.timestamp !== 'number' || isNaN(item.timestamp)) {
        console.warn('⚠️ Invalid timestamp found:', item);
        return;
      }
      
      const roundedTime = Math.floor(item.timestamp / ms) * ms;
      
      if (!grouped.has(roundedTime)) {
        grouped.set(roundedTime, {
          timestamp: roundedTime,
          open: item.value,
          high: item.value,
          low: item.value,
          close: item.value,
          volume: 1,
          values: [item.value]
        });
      } else {
        const candle = grouped.get(roundedTime);
        candle.high = Math.max(candle.high, item.value);
        candle.low = Math.min(candle.low, item.value);
        candle.close = item.value;
        candle.volume += 1;
        candle.values.push(item.value);
      }
    });
    
    const result = Array.from(grouped.values());
    //console.log(`✅ Grouping completed. Created ${result.length} groups.`);
    return result;
  }

  // Candle stick verisi oluştur
  createCandleData(data, timeUnit, count) {
    const grouped = this.groupDataByTimeInterval(data, timeUnit, count);
    
    return grouped.map(candle => ({
      timestamp: candle.timestamp,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volume
    }));
  }

  // Line chart verisi oluştur
  createLineData(data, timeUnit, count) {
    const grouped = this.groupDataByTimeInterval(data, timeUnit, count);
    
    // Her grubun ortalama değerini alarak yeni veri noktaları oluştur
    return grouped.map(group => ({
      timestamp: group.timestamp,
      value: group.values.reduce((a, b) => a + b, 0) / group.values.length
    }));
  }
}

const mqttProcessor = new MqttDataProcessor();
const chartProcessor = new ChartDataProcessor();

// Worker mesajlarını dinle
parentPort.on('message', async (message) => {
  //console.log(`📨 MQTT worker received message:`, { id: message.id, type: message.type });
  try {
    switch (message.type) {
      case 'process-mqtt-data':
        //console.log(`🔍 Processing MQTT data:`, { rawDataLength: message.data.rawData?.length, variableConfig: message.data.variableConfig });
        const processedData = mqttProcessor.processMqttData(message.data.rawData, message.data.variableConfig);
        if (processedData) {
          mqttProcessor.addToBuffer(processedData);
        }
        //console.log(`✅ MQTT data processed:`, processedData);
        parentPort.postMessage({ 
          id: message.id, 
          type: 'success', 
          data: processedData 
        });
        break;
        
      case 'get-chart-data':
        //console.log(`🔍 Processing chart data request:`, { dataLength: message.data.data?.length, timeUnit: message.data.timeUnit, chartType: message.data.chartType });
        const { data, timeUnit, count, chartType } = message.data; // Gelen veriyi kullan
        
        let chartData;
        if (chartType === 'candlestick') {
          chartData = chartProcessor.createCandleData(data, timeUnit, count);
        } else {
          chartData = chartProcessor.createLineData(data, timeUnit, count);
        }
        
        //console.log(`✅ Chart data created:`, { chartDataLength: chartData?.length, chartType });
        parentPort.postMessage({ 
          id: message.id, 
          type: 'success', 
          data: chartData 
        });
        break;
        
      case 'get-stats':
        //console.log(`🔍 Processing stats request`);
        const stats = mqttProcessor.calculateStats();
        //console.log(`✅ Stats calculated:`, stats);
        parentPort.postMessage({ 
          id: message.id, 
          type: 'success', 
          data: stats 
        });
        break;
        
      case 'clear-buffer':
        //console.log(`🔍 Clearing buffer`);
        mqttProcessor.clearBuffer();
        //console.log(`✅ Buffer cleared`);
        parentPort.postMessage({ 
          id: message.id, 
          type: 'success' 
        });
        break;
        
      default:
        console.warn(`⚠️ Unknown message type: ${message.type}`);
        parentPort.postMessage({ 
          id: message.id, 
          type: 'error', 
          error: 'Unknown message type' 
        });
    }
  } catch (error) {
    console.error(`❌ MQTT worker error:`, error);
    parentPort.postMessage({ 
      id: message.id, 
      type: 'error', 
      error: error.message 
    });
  }
}); 