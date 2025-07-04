const { parentPort, workerData } = require('worker_threads');
const { Pool } = require('pg');
const sql = require('mssql');

// PostgreSQL bağlantı konfigürasyonu
const pgConfig = {
  user: process.env.DB_USER || 'zeynep',
  host: process.env.DB_HOST || '10.10.30.31',
  password: process.env.DB_PASSWORD || 'zeynep421',
  port: parseInt(process.env.DB_PORT || '5432'),
};

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

let mssqlPool;

// Worker mesajlarını dinle
parentPort.on('message', async (message) => {
  //console.log(`📨 Database worker received message:`, { id: message.id, type: message.type });
  try {
    switch (message.type) {
      case 'get-tables':
        //console.log(`🔍 Processing get-tables request:`, message.data);
        const result = await handleGetTables(message.data);
        //console.log(`✅ get-tables completed, rows:`, result?.length || 0);
        parentPort.postMessage({ id: message.id, type: 'success', data: result });
        break;
        
      case 'get-mssql-tables':
        //console.log(`🔍 Processing get-mssql-tables request`);
        const mssqlResult = await handleGetMssqlTables();
        //console.log(`✅ get-mssql-tables completed, rows:`, mssqlResult?.length || 0);
        parentPort.postMessage({ id: message.id, type: 'success', data: mssqlResult });
        break;
        
      case 'get-all-GESdbs-and-their-tables-for-dropdowns':
        //console.log(`🔍 Processing get-all-databases request`);
        const dbResult = await handle_get_all_GESdbs_and_their_tables_for_dropdowns();
        //console.log(`✅ get-all-GESdbs-and-their-tables-for-dropdowns completed, databases:`, Object.keys(dbResult || {}));
        parentPort.postMessage({ id: message.id, type: 'success', data: dbResult });
        break;
        
      default:
        console.warn(`⚠️ Unknown message type: ${message.type}`);
        parentPort.postMessage({ id: message.id, type: 'error', error: 'Unknown message type' });
    }
  } catch (error) {
    console.error(`❌ Database worker error:`, error);
    parentPort.postMessage({ id: message.id, type: 'error', error: error.message });
  }
});

async function handleGetTables({ dbName, tableName, limit, startTime, endTime }) {
  //console.log("startTime",startTime ,endTime);
  const tempPool = new Pool({
    ...pgConfig,
    database: dbName,
    max: 2,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
  });
  
  try {
    let query = `SELECT * FROM "${tableName}"`;
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
    
    const result = await tempPool.query(query, params);

    
    return result.rows;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw new Error(`Database query failed: ${error.message}`);
  } finally {
    // Geçici pool'u kapat
    await tempPool.end();
  }
}

async function handleGetMssqlTables() {
  if (!mssqlPool) {
    mssqlPool = await sql.connect(mssqlConfig);
  }
  
  const result = await mssqlPool
    .request()
    .query(`
      SELECT
        latest.ID,
        vars.NAME,
        latest.WERT,
        CONVERT(VARCHAR(19), latest.DATUMZEIT, 120) AS DATUMZEIT,
        latest.STATUS
      FROM
        (SELECT DISTINCT NAME FROM dbo.ENERGY) AS vars
        OUTER APPLY (
          SELECT TOP 1 ID,WERT,DATUMZEIT,STATUS
          FROM dbo.ENERGY
          WHERE NAME = vars.NAME
          ORDER BY DATUMZEIT DESC
        ) AS latest
    `);
    
    return result.recordset.map(row => {
      const statusRaw = Number(row.STATUS); 
      const statusBinary = statusRaw.toString(2).padStart(32, '0'); 
      const isSpontaneous = statusBinary.charAt(14) === '1';  
      const isOutage=isSpontaneous==true&&Math.abs(row.WERT)<5
  
      return {
        name: row.NAME,
        WERT: Math.abs(Number(row.WERT)),
        DATUMZEIT: row.DATUMZEIT,
        ID: row.ID,
        isOutage: isOutage,
        STATUS: statusRaw,
        //STATUS_BINARY: statusBinary, // debug için görmek istersen */
        isSpontaneous: isSpontaneous
      };
    });
  }
async function handle_get_all_GESdbs_and_their_tables_for_dropdowns() {
  // Ana postgres veritabanına geçici bağlantı
  const mainPool = new Pool({
    ...pgConfig,
    database: 'postgres',
    max: 2,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
  });
  
  try {
    const dbs = await mainPool.query("SELECT datname FROM pg_database WHERE datistemplate = false;");
    const result = {};
    
    for (const row of dbs.rows) {
      const dbName = row.datname;
      if (dbName.includes('postgres') || dbName.includes('facility')) continue;
    
      const tempPool = new Pool({
        ...pgConfig,
        database: dbName,
        max: 2,
        idleTimeoutMillis: 10000,
        connectionTimeoutMillis: 10000, // bağlantı süresi artırıldı
      });
    
      try {
        const tables = await tempPool.query(
          "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
        );
    
        if (dbName.includes('zenon')) {
          result[dbName] = {}; // ← kritik: boş nesne oluştur
          for (const r of tables.rows) {
            const columns = await tempPool.query(`SELECT column_name FROM information_schema.columns WHERE table_name = '${r.table_name}'`);
            result[dbName][r.table_name] = columns.rows.map(c => c.column_name);
          }
        } else {
          result[dbName] = tables.rows.map(r => r.table_name);
        }
      } catch (e) {
        console.error(`Database connection error for ${dbName}:`, e.message);
        result[dbName] = [];
      } finally {
        await tempPool.end();
      }
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error in handle_get_all_GESdbs_and_their_tables_for_dropdowns:', error);
    throw error;
  } finally {
    // Ana postgres pool'u da kapat
    await mainPool.end();
  }
}

// Worker kapatılırken bağlantıları temizle
process.on('exit', () => {
  console.log('🔌 Closing all PostgreSQL pools...');
  if (mssqlPool) mssqlPool.close();
  console.log('✅ All pools closed.');
}); 