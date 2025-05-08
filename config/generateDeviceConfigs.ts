import * as fs from 'fs';
import * as path from 'path';

// Veri tiplerini ve anlamlarını tutacak interface
interface DataField {
  name: string;
  type: string;
  multiplier: number;
  aggregation: 'avg' | 'last' | '';
  index: number;
}

// Her araç tipi için veri alanlarını tutacak interface
type DeviceFields = DataField[];

// Her GES için araç konfigürasyonlarını tutacak interface
interface DeviceConfig {
  [deviceType: string]: DeviceFields;
}

// Her GES için araç konfigürasyonlarını tutacak interface
interface GesConfig {
  [gesName: string]: DeviceConfig;
}

// Tüm konfigürasyonları tutacak ana interface
interface AllConfigs {
  [ilName: string]: GesConfig;
}

function parseConfigLine(line: string, index: number): DataField | null {
  if (!line.trim() || line.startsWith('#') || line.includes(':')) return null;
  // Remove trailing semicolon
  const cleanLine = line.replace(/;$/, '');
  const parts = cleanLine.split(',');

  // RTU: address,name,type
  if (parts.length === 3) {
    const [address, name, type] = parts;
    return {
      name: name.trim(),
      type: type.trim(),
      multiplier: 1,
      aggregation: '',
      index
    };
  }
  // address,type,multiplier,name
  if (parts.length === 4) {
    const [address, type, multiplier, name] = parts;
    return {
      name: name.trim(),
      type: type.trim(),
      multiplier: parseFloat(multiplier) || 1,
      aggregation: '',
      index
    };
  }
  // address,type,multiplier,name,aggregation
  if (parts.length >= 5) {
    const [address, type, multiplier, name, aggregation = ''] = parts;
  return {
    name: name.trim(),
    type: type.trim(),
      multiplier: parseFloat(multiplier) || 1,
      aggregation: aggregation.trim() as 'avg' | 'last' | '',
      index
  };
  }
  return null;
}

function readDeviceConfig(filePath: string): DataField[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const fields: DataField[] = [];

  let fieldIndex = 0;
  lines.forEach(line => {
    const field = parseConfigLine(line, fieldIndex);
    if (field) {
      fields.push(field);
      fieldIndex++;
    }
  });

  return fields;
}

function generateConfigs(): AllConfigs {
  // settings klasörü artık config klasörünün içinde
  const settingsDir = path.join(__dirname, 'settings');
  const configs: AllConfigs = {};

  // Her il klasörünü tara
  const ilDirs = fs.readdirSync(settingsDir);
  ilDirs.forEach(ilDir => {
    const ilPath = path.join(settingsDir, ilDir);
    if (!fs.statSync(ilPath).isDirectory()) return;

    const [ilName, gesName] = ilDir.split('_');
    if (!ilName || !gesName) return;

    // İl için GES konfigürasyonlarını başlat
    if (!configs[ilName]) {
      configs[ilName] = {};
    }

    // GES için araç konfigürasyonlarını oku
    const deviceConfigs: DeviceConfig = {};
    const configFiles = fs.readdirSync(ilPath);
    
    configFiles.forEach(file => {
      if (file.endsWith('_config.txt')) {
        const deviceType = file.split('_')[0]; // inverter, rtu, analizor
        const configPath = path.join(ilPath, file);
        deviceConfigs[deviceType] = readDeviceConfig(configPath);
      }
    });

    configs[ilName][gesName] = deviceConfigs;
  });

  return configs;
}

function generateConfigFile(configs: AllConfigs) {
  // 1. JS dosyasını oluştur
  const jsOutputPath = path.join(__dirname, '..', 'deviceConfigs.js');
  let content = `// Bu dosya otomatik olarak oluşturulmuştur. Lütfen manuel olarak düzenlemeyin.
// Son güncelleme: ${new Date().toISOString()}

const deviceConfigs = ${JSON.stringify(configs, null, 2)};

// Yardımcı fonksiyonlar
function getDataValue(data, ilName, gesName, deviceType, fieldName) {
  const config = deviceConfigs[ilName]?.[gesName]?.[deviceType]?.[fieldName];
  if (!config) {
    throw new Error('Invalid configuration: ' + ilName + '.' + gesName + '.' + deviceType + '.' + fieldName);
  }
  // Veri indeksini bul (config dosyasındaki sıraya göre)
  const fields = Object.keys(deviceConfigs[ilName][gesName][deviceType]);
  const index = fields.indexOf(fieldName);
  if (index === -1) {
    throw new Error('Field not found: ' + fieldName);
  }
  const rawValue = data[index + 1]; // +1 because first element is timestamp
  return rawValue * config.multiplier;
}

function getAvailableFields(ilName, gesName, deviceType) {
  return Object.keys(deviceConfigs[ilName]?.[gesName]?.[deviceType] || {});
}

function getDeviceTypes(ilName, gesName) {
  return Object.keys(deviceConfigs[ilName]?.[gesName] || {});
}

function getGesList(ilName) {
  return Object.keys(deviceConfigs[ilName] || {});
}

function getIlList() {
  return Object.keys(deviceConfigs);
}

module.exports = {
  deviceConfigs,
  getDataValue,
  getAvailableFields,
  getDeviceTypes,
  getGesList,
  getIlList
};
`;

  // JS çıktısı için dizin oluştur ve yaz
  const jsOutputDir = path.dirname(jsOutputPath);
  if (!fs.existsSync(jsOutputDir)) {
    fs.mkdirSync(jsOutputDir, { recursive: true });
  }
  fs.writeFileSync(jsOutputPath, content);
  console.log(`Konfigürasyon dosyası oluşturuldu: ${jsOutputPath}`);

  // 2. JSON dosyasını oluştur
  const jsonOutputDir = path.join(__dirname, '../src/config');
  const jsonOutputPath = path.join(jsonOutputDir, 'deviceConfigs.json');
  if (!fs.existsSync(jsonOutputDir)) {
    fs.mkdirSync(jsonOutputDir, { recursive: true });
  }
  fs.writeFileSync(jsonOutputPath, JSON.stringify(configs, null, 2), 'utf-8');
  console.log('deviceConfigs.json başarıyla oluşturuldu:', jsonOutputPath);
}

// Ana fonksiyon
function main() {
  try {
    const configs = generateConfigs();
    generateConfigFile(configs);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

main(); 