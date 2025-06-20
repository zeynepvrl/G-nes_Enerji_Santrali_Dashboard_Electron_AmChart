import { VariableConfig } from './device';
import { ProcessedMqttData, MqttDataCallback, MqttUnsubscribe } from './mqtt';
import { ChartDataPoint, CandleData, ChartDataRequest } from './chart';

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
export interface ElectronAPI {
  /**
   * Get historical data from database
   */
  getTablesHistory: (
    dbName: string, 
    tableName?: string, 
    limit?: number, 
    startTime?: Date, 
    endTime?: Date
  ) => Promise<DatabaseRecord[]>;

  /**
   * Get all GES databases and their tables for dropdowns
   */
  get_all_GESdbs_and_their_tables_for_dropdowns: () => Promise<DatabaseTables>;

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
  onMqttData: (callback: MqttDataCallback) => MqttUnsubscribe;

  /**
   * Process MQTT data using worker
   */
  processMqttData: (
    rawData: string, 
    variableConfig: VariableConfig
  ) => Promise<ProcessedMqttData | null>;

  /**
   * Get chart data using worker
   */
  getChartData: (data: ChartDataRequest) => Promise<CandleData[] | ChartDataPoint[]>;
} 