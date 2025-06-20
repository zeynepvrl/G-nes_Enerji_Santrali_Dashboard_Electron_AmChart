const { Worker } = require('worker_threads');
const path = require('path');

class WorkerManager {
  constructor() {
    this.workers = new Map();
    this.messageId = 0;
    this.pendingMessages = new Map();
  }

  // Worker oluştur
  createWorker(workerType) {
    console.log(`🔧 Creating worker: ${workerType}`);
    const workerPath = path.join(__dirname, `${workerType}-worker.js`);
    
    const worker = new Worker(workerPath, {
      workerData: { type: workerType }
    });

    // Worker mesajlarını dinle
    worker.on('message', (message) => {
      console.log(`📨 Worker ${workerType} message received:`, { id: message.id, type: message.type });
      this.handleWorkerMessage(message);
    });

    // Worker hatalarını dinle
    worker.on('error', (error) => {
      console.error(`❌ Worker ${workerType} error:`, error);
      this.workers.delete(workerType);
    });

    // Worker kapanışını dinle
    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`❌ Worker ${workerType} stopped with exit code ${code}`);
      } else {
        console.log(`✅ Worker ${workerType} exited normally`);
      }
      this.workers.delete(workerType);
    });

    this.workers.set(workerType, worker);
    console.log(`✅ Worker ${workerType} created successfully`);
    return worker;
  }

  // Worker'ı al veya oluştur
  getWorker(workerType) {
    if (!this.workers.has(workerType)) {
      this.createWorker(workerType);
    }
    return this.workers.get(workerType);
  }

  // Worker'a mesaj gönder ve Promise döndür
  sendMessage(workerType, message) {
    console.log(`📤 Sending message to worker ${workerType}:`, { type: message.type, dataKeys: Object.keys(message.data || {}) });
    return new Promise((resolve, reject) => {
      const worker = this.getWorker(workerType);
      const messageId = ++this.messageId;

      // Bekleyen mesajı kaydet
      this.pendingMessages.set(messageId, { resolve, reject });

      // Timeout ayarla (30 saniye)
      setTimeout(() => {
        if (this.pendingMessages.has(messageId)) {
          this.pendingMessages.delete(messageId);
          console.error(`⏰ Worker ${workerType} message timeout for messageId: ${messageId}`);
          reject(new Error('Worker message timeout'));
        }
      }, 30000);

      // Mesajı gönder
      worker.postMessage({
        id: messageId,
        ...message
      });
    });
  }

  // Worker mesajlarını işle
  handleWorkerMessage(message) {
    const { id, type, data, error } = message;
    console.log(`📨 Processing worker message:`, { id, type, hasData: !!data, hasError: !!error });
    
    if (this.pendingMessages.has(id)) {
      const { resolve, reject } = this.pendingMessages.get(id);
      this.pendingMessages.delete(id);

      if (type === 'success') {
        console.log(`✅ Worker message ${id} resolved successfully`);
        resolve(data);
      } else {
        console.error(`❌ Worker message ${id} failed:`, error);
        reject(new Error(error || 'Worker error'));
      }
    } else {
      console.warn(`⚠️ No pending message found for id: ${id}`);
    }
  }

  // Tüm worker'ları kapat
  async terminateAll() {
    const promises = [];
    
    for (const [type, worker] of this.workers) {
      console.log(`Terminating worker: ${type}`);
      promises.push(worker.terminate());
    }
    
    await Promise.all(promises);
    this.workers.clear();
    this.pendingMessages.clear();
  }

  // Belirli bir worker'ı kapat
  async terminateWorker(workerType) {
    const worker = this.workers.get(workerType);
    if (worker) {
      await worker.terminate();
      this.workers.delete(workerType);
    }
  }

  // Worker durumunu kontrol et
  isWorkerActive(workerType) {
    return this.workers.has(workerType);
  }

  // Aktif worker sayısını getir
  getActiveWorkerCount() {
    return this.workers.size;
  }

  // Bekleyen mesaj sayısını getir
  getPendingMessageCount() {
    return this.pendingMessages.size;
  }
}

// Singleton instance
const workerManager = new WorkerManager();

module.exports = workerManager; 