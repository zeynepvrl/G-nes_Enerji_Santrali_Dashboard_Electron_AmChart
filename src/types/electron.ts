import { VariableConfig } from './device';
import { ProcessedMqttData, MqttDataCallback, MqttUnsubscribe } from './mqtt';
import { ChartDataPoint, CandleData, ChartDataRequest, TimeInterval, ChartType } from './chart';
import { DropdownData, GesDatabaseMapping } from './device';
import { Measurement, Limit } from './alarms';

/**
 * Database history record interface
 */
export interface DatabaseRecord {
  timestamp: string;
  [key: string]: string | number | boolean;
}

/**
 * Database tables structure
 */
export interface DatabaseTables {
  [dbName: string]: string[];
}

/**
 * Electron API interface for main process communication
 */

// //TypeScript'te interface (arayüz), bir nesnenin hangi özelliklere ve fonksiyonlara sahip olması gerektiğini tanımlayan bir yapıdır. 
// Yani bir tür (type) tanımıdır ama daha yapısal ve genişletilebilir bir şekilde kullanılır.
//Bu arayüz (interface), preload.js içinde tanımlanıp contextBridge üzerinden window'a aktarılan tüm fonksiyonların tipini belirtir.
export interface ElectronAPI {
  /**
   * Get historical data from database
   */
  getTablesHistory: (
    dbName: string, 
    tableName: string, 
    limit?: number, 
    startTime?: string, 
    endTime?: string
  ) => Promise<any[]>;

  /**
   * Get all GES databases and their tables for dropdowns
   */
  getAllGESdbsAndTheirTablesForDropdowns: () => Promise<GesDatabaseMapping>;

  /**
   * Subscribe to MQTT topic
   */
  subscribeMqtt: (topic: string) => void;

  /**
   * Unsubscribe from MQTT topic
   */
  unsubscribeMqtt: (topic: string) => void;

  /**
   * Listen to MQTT data
   */
  onMqttData: (callback: (data: string, topic: string) => void) => () => void;

  /**
   * Process MQTT data using worker
   */
  processMqttData: (
    rawData: string, 
    variableConfig: any
  ) => Promise<ProcessedMqttData | null>;

  /**
   * Get chart data using worker
   */
  getChartData: (
    data: {
      data: ChartDataPoint[],
      timeUnit: TimeInterval['timeUnit'],
      count: number,
      chartType: ChartType
    }
  ) => Promise<CandleData[] | ChartDataPoint[]>;

  getMssqlTables: () => Promise<Measurement[]>;
  getLimits: () => Promise<Limit[]>;
  updateLimit: (name: string, newLimit: number) => Promise<{ success: boolean; error?: string }>;
  logToOutage: (outages: Measurement[]) => Promise<void>;
  getGesInfo: () => Promise<Record<string, any>>;
} 