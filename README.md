# Energy Dashboard

Bu proje, Electron ve React tabanlı bir masaüstü enerji yönetim panelidir. PostgreSQL veritabanı ve MQTT protokolü ile gerçek zamanlı veri takibi ve görselleştirme sağlar.

## Özellikler
- **Electron + React**: Modern masaüstü uygulama deneyimi
- **PostgreSQL**: Veritabanı bağlantısı ve dinamik dropdownlar
- **MQTT**: Gerçek zamanlı veri akışı ve cihaz takibi
- **amCharts 5**: Gelişmiş grafikler ve finansal veri görselleştirme
- **Dinamik Dropdownlar**: İl, GES ve araç (tablo) seçimi
- **Otomatik MQTT Topic Yönetimi**: Sadece seçili cihaza abone olunur

## Kurulum
1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
2. Geliştirme modunda başlatmak için:
   ```bash
   npm run electron:dev
   ```
3. Sadece React arayüzünü başlatmak için:
   ```bash
   npm run dev
   ```

## Yapı
- `main.js`: Electron ana süreç, veritabanı ve MQTT yönetimi
- `preload.js`: Ana süreç ile arayüz arasında güvenli köprü
- `src/components/Overview/Overview.tsx`: Ana arayüz ve grafikler

## Notlar
- Veritabanı ve MQTT bağlantı bilgilerinizi kendi ortamınıza göre güncelleyin.
- Sadece seçili cihaza MQTT abonesi olunur, gereksiz trafik engellenir.

## Katkı
Pull request ve issue'larınızı bekliyoruz! 



npm run dist ile build edersin release dosyasında exe dosyası kurulum dosyası 
package.json daki verisionu güncelleyerek push edersen kullanıcılarda da güncellenir
bu otamatik güncellemeyi git bash a github dan aldığım token ile sağladım