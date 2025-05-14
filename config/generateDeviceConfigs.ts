import * as fs from 'fs';
import * as path from 'path';

// veri tiplerini ve anlamlarını tutacak interface
interface datafield {
  name: string;
  type: string;
  multiplier: number;
  aggregation: 'avg' | 'last' | '';
  index: number;
}

// her araç tipi için veri alanlarını tutacak interface
type devicefields = datafield[];

// her ges için araç konfigürasyonlarını tutacak interface
interface deviceconfig {
  [devicetype: string]: devicefields;
}

// her ges için araç konfigürasyonlarını tutacak interface
interface gesconfig {
  [gesname: string]: deviceconfig;
}

// tüm konfigürasyonları tutacak ana interface
interface allconfigs {
  [ilname: string]: gesconfig;
}

function parseconfigline(line: string, index: number): datafield | null {
  if (!line.trim() || line.startsWith('#') || line.includes(':')) return null;
  // remove trailing semicolon
  const cleanline = line.replace(/;$/, '');
  const parts = cleanline.split(',');

  // rtu: address,name,type
  if (parts.length === 3) {
    const [address, name, type] = parts;
    return {
      name: name.trim().toLowerCase().replace(/;$/, ''),
      type: type.trim().toLowerCase(),
      multiplier: 1,
      aggregation: '',
      index
    };
  }
  // address,type,multiplier,name
  if (parts.length === 4) {
    const [address, type, multiplier, name] = parts;
    return {
      name: name.trim().toLowerCase().replace(/;$/, ''),
      type: type.trim().toLowerCase(),
      multiplier: parseFloat(multiplier) || 1,
      aggregation: '',
      index
    };
  }
  // address,type,multiplier,name,aggregation
  if (parts.length >= 5) {
    const [address, type, multiplier, name, aggregation = ''] = parts;
    return {
      name: name.trim().toLowerCase().replace(/;$/, ''),
      type: type.trim().toLowerCase(),
      multiplier: parseFloat(multiplier) || 1,
      aggregation: aggregation.trim().toLowerCase() as 'avg' | 'last' | '',
      index
    };
  }
  return null;
}

function readdeviceconfig(filepath: string): datafield[] {
  const content = fs.readFileSync(filepath, 'utf-8');
  const lines = content.split('\n');
  const fields: datafield[] = [];

  let fieldindex = 0;
  lines.forEach(line => {
    const field = parseconfigline(line, fieldindex);
    if (field) {
      fields.push(field);
      fieldindex++;
    }
  });

  return fields;
}

function generateconfigs(): allconfigs {
  // settings klasörü artık config klasörünün içinde
  const settingsdir = path.join(__dirname, 'settings');
  const configs: allconfigs = {};

  // her il klasörünü tara
  const ildirs = fs.readdirSync(settingsdir);
  ildirs.forEach(ildir => {
    const ilpath = path.join(settingsdir, ildir);
    if (!fs.statSync(ilpath).isDirectory()) return;

    const [rawIlname, rawGesname] = ildir.split('_');
    const ilname = rawIlname.trim().toLowerCase();
    const gesname = rawGesname.trim().toLowerCase();
    if (!ilname || !gesname) return;

    // il için ges konfigürasyonlarını başlat
    if (!configs[ilname]) {
      configs[ilname] = {};
    }

    // ges için araç konfigürasyonlarını oku
    const deviceconfigs: deviceconfig = {};
    const configfiles = fs.readdirSync(ilpath);
    
    configfiles.forEach(file => {
      if (file.endsWith('_config.txt')) {
        const devicetype = file.split('_')[0]; // inverter, rtu, analizor
        const configpath = path.join(ilpath, file);
        deviceconfigs[devicetype] = readdeviceconfig(configpath);
      }
    });

    configs[ilname][gesname] = deviceconfigs;
  });

  return configs;
}

function generateconfigfile(configs: allconfigs) {
  // 1. js dosyasını oluştur
  const jsoutputpath = path.join(__dirname, '..', 'deviceconfigs.js');
  let content = `// bu dosya otomatik olarak oluşturulmuştur. lütfen manuel olarak düzenlemeyin.
// son güncelleme: ${new Date().toISOString()}

const deviceconfigs = ${JSON.stringify(configs, null, 2)};

// yardımcı fonksiyonlar
function getdatavalue(data, ilname, gesname, devicetype, fieldname) {
  const config = deviceconfigs[ilname]?.[gesname]?.[devicetype]?.[fieldname];
  if (!config) {
    throw new Error('invalid configuration: ' + ilname + '.' + gesname + '.' + devicetype + '.' + fieldname);
  }
  // veri indeksini bul (config dosyasındaki sıraya göre)
  const fields = Object.keys(deviceconfigs[ilname][gesname][devicetype]);
  const index = fields.indexOf(fieldname);
  if (index === -1) {
    throw new Error('field not found: ' + fieldname);
  }
  const rawvalue = data[index + 1]; // +1 because first element is timestamp
  return rawvalue * config.multiplier;
}

function getavailablefields(ilname, gesname, devicetype) {
  return Object.keys(deviceconfigs[ilname]?.[gesname]?.[devicetype] || {});
}

function getdevicetypes(ilname, gesname) {
  return Object.keys(deviceconfigs[ilname]?.[gesname] || {});
}

function getgeslist(ilname) {
  return Object.keys(deviceconfigs[ilname] || {});
}

function getillist() {
  return Object.keys(deviceconfigs);
}

module.exports = {
  deviceconfigs,
  getdatavalue,
  getavailablefields,
  getdevicetypes,
  getgeslist,
  getillist
};
`;

  // js çıktısı için dizin oluştur ve yaz
  const jsoutputdir = path.dirname(jsoutputpath);
  if (!fs.existsSync(jsoutputdir)) {
    fs.mkdirSync(jsoutputdir, { recursive: true });
  }
  fs.writeFileSync(jsoutputpath, content);
  console.log(`konfigürasyon dosyası oluşturuldu: ${jsoutputpath}`);

  // 2. json dosyasını oluştur
  const jsonoutputdir = path.join(__dirname, '../src/config');
  const jsonoutputpath = path.join(jsonoutputdir, 'deviceconfigs.json');
  if (!fs.existsSync(jsonoutputdir)) {
    fs.mkdirSync(jsonoutputdir, { recursive: true });
  }
  fs.writeFileSync(jsonoutputpath, JSON.stringify(configs, null, 2), 'utf-8');
  console.log('deviceconfigs.json başarıyla oluşturuldu:', jsonoutputpath);
}

// ana fonksiyon
function main() {
  try {
    const configs = generateconfigs();
    generateconfigfile(configs);
  } catch (error) {
    console.error('hata:', error);
    process.exit(1);
  }
}

main(); 