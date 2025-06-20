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

let pgPool;
let mssqlPool;
const pgPools = new Map();

function getPgPool(dbName) {
  if (!pgPools.has(dbName)) {
    console.log(`🔧 Creating new PostgreSQL pool for database: ${dbName}`);
    const pool = new Pool({ ...pgConfig, database: dbName });
    pool.on('error', (err) => {
      console.error(`❌ PostgreSQL pool error for ${dbName}:`, err);
      pgPools.delete(dbName);
    });
    pgPools.set(dbName, pool);
  }
  console.log(`✅ Using PostgreSQL pool for database: ${dbName}`);
  return pgPools.get(dbName);
}

// Worker mesajlarını dinle
parentPort.on('message', async (message) => {
  console.log(`📨 Database worker received message:`, { id: message.id, type: message.type });
  try {
    switch (message.type) {
      case 'get-tables':
        console.log(`🔍 Processing get-tables request:`, message.data);
        const result = await handleGetTables(message.data);
        console.log(`✅ get-tables completed, rows:`, result?.length || 0);
        parentPort.postMessage({ id: message.id, type: 'success', data: result });
        break;
        
      case 'get-mssql-tables':
        console.log(`🔍 Processing get-mssql-tables request`);
        const mssqlResult = await handleGetMssqlTables();
        console.log(`✅ get-mssql-tables completed, rows:`, mssqlResult?.length || 0);
        parentPort.postMessage({ id: message.id, type: 'success', data: mssqlResult });
        break;
        
      case 'get-all-databases':
        console.log(`🔍 Processing get-all-databases request`);
        const dbResult = await handleGetAllDatabases();
        console.log(`✅ get-all-databases completed, databases:`, Object.keys(dbResult || {}));
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
  const pgPool = getPgPool(dbName);
  
  // Table name validation
  if (!tableName || !/^[a-zA-Z0-9_]+$/.test(tableName)) {
    throw new Error('Invalid table name');
  }
  
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
  
  const result = await pgPool.query(query, params);
  return result.rows;
}

async function handleGetMssqlTables() {
  if (!mssqlPool) {
    mssqlPool = await sql.connect(mssqlConfig);
  }
  
  const result = await mssqlPool
    .request()
    .query(`
      SELECT
        vars.NAME,
        latest.WERT,
        CONVERT(VARCHAR(19), latest.DATUMZEIT, 120) AS DATUMZEIT
      FROM
        (SELECT DISTINCT NAME FROM dbo.ENERGY) AS vars
        OUTER APPLY (
          SELECT TOP 1 WERT, DATUMZEIT
          FROM dbo.ENERGY
          WHERE NAME = vars.NAME
          ORDER BY DATUMZEIT DESC
        ) AS latest
    `);
    
  return result.recordset.map(row => ({
    name: row.NAME,
    WERT: Math.abs(Number(row.WERT)),
    DATUMZEIT: row.DATUMZEIT,
  }));
}

async function handleGetAllDatabases() {
  const pool = getPgPool('postgres');
  
  try {
    const dbs = await pool.query("SELECT datname FROM pg_database WHERE datistemplate = false;");
    const result = {};
    
    for (const row of dbs.rows) {
      const dbName = row.datname;
      const tempPool = getPgPool(dbName);
      
      try {
        const tables = await tempPool.query(
          "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
        );
        result[dbName] = tables.rows.map(r => r.table_name);
      } catch (e) {
        console.error(`Database connection error for ${dbName}:`, e);
        result[dbName] = [];
      }
    }
    
    return result;
  } finally {
    // No need to end the main pool here either
  }
}

// Worker kapatılırken bağlantıları temizle
process.on('exit', () => {
  console.log('🔌 Closing all PostgreSQL pools...');
  for (const pool of pgPools.values()) {
    pool.end();
  }
  if (mssqlPool) mssqlPool.close();
  console.log('✅ All pools closed.');
}); 