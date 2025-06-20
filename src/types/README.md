# TypeScript Types Documentation

Bu dizin, uygulamanın tüm TypeScript tip tanımlarını modüler bir yapıda içerir.

## Dosya Yapısı

```
src/types/
├── index.ts          # Tüm tipleri dışa aktaran ana dosya
├── chart.ts          # Grafik ve veri görselleştirme tipleri
├── device.ts         # Cihaz ve değişken konfigürasyon tipleri
├── mqtt.ts           # MQTT iletişim tipleri
├── electron.ts       # Electron API tipleri
└── README.md         # Bu dosya
```

## Tip Kategorileri

### 📊 Chart Types (`chart.ts`)

Grafik ve veri görselleştirme ile ilgili tipler:

- `ChartDataPoint`: Zaman serisi veri noktası
- `CandleData`: OHLCV mum verisi
- `TimeInterval`: Zaman aralığı konfigürasyonu
- `ChartType`: Grafik türü seçenekleri
- `ChartDataRequest`: Worker işleme için veri isteği parametreleri

### 🔧 Device Types (`device.ts`)

Cihaz ve değişken konfigürasyonu ile ilgili tipler:

- `VariableConfig`: Değişken konfigürasyonu
- `DeviceType`: Cihaz türü enum'u
- `DeviceGroup`: Cihaz grubu enum'u
- `DeviceConfig`: Cihaz konfigürasyon yapısı
- `DropdownData`: Dropdown veri yapısı

### 📡 MQTT Types (`mqtt.ts`)

MQTT iletişimi ile ilgili tipler:

- `ProcessedMqttData`: İşlenmiş MQTT verisi
- `MqttDataCallback`: MQTT veri callback fonksiyonu
- `MqttUnsubscribe`: MQTT abonelik iptal fonksiyonu
- `MqttTopic`: MQTT topic yapısı
- `MqttTopicString`: MQTT topic string formatı

### ⚡ Electron Types (`electron.ts`)

Electron API ile ilgili tipler:

- `DatabaseRecord`: Veritabanı kayıt arayüzü
- `DatabaseTables`: Veritabanı tabloları yapısı
- `ElectronAPI`: Electron API arayüzü

## Kullanım

### Import

```typescript
// Tüm tipleri import et
import { ChartDataPoint, VariableConfig, ProcessedMqttData } from '../../types';

// Veya belirli kategoriden import et
import { ChartDataPoint, CandleData } from '../../types/chart';
import { VariableConfig, DeviceType } from '../../types/device';
```

### Örnek Kullanım

```typescript
// Chart verisi oluştur
const dataPoint: ChartDataPoint = {
  timestamp: Date.now(),
  value: 123.45
};

// Cihaz konfigürasyonu
const config: VariableConfig = {
  name: "voltage",
  index: 1
};

// MQTT verisi işle
const mqttData: ProcessedMqttData = {
  timestamp: Date.now(),
  value: 230.5,
  raw: originalData
};
```

## Tip Güvenliği

Bu modüler yapı sayesinde:

- ✅ Tip tutarlılığı sağlanır
- ✅ Kod tamamlama (IntelliSense) gelişir
- ✅ Derleme zamanı hata kontrolü yapılır
- ✅ Kod okunabilirliği artar
- ✅ Yeniden kullanılabilirlik sağlanır

## Geliştirme Kuralları

1. **Yeni tip eklerken**: İlgili kategorideki dosyaya ekleyin
2. **Mevcut tipleri değiştirirken**: Geriye uyumluluğu koruyun
3. **Export ederken**: `index.ts` dosyasına eklemeyi unutmayın
4. **Dokümantasyon**: Her tip için JSDoc yorumu ekleyin
5. **Naming**: Açıklayıcı ve tutarlı isimlendirme kullanın 