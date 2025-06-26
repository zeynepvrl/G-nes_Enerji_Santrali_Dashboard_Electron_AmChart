/**
 * Variable configuration for device data processing
 */
export interface VariableConfig {
  name: string;
  index: number;
}

/**
 * Device type enumeration
 */
export type DeviceType = 'inverter' | 'analizor' | 'rtu';

/**
 * Device group enumeration for MQTT topics
 */
export type DeviceGroup = 'inverters' | 'analizors' | 'rtus' | 'history';

/**
 * Device configuration structure
 */
export interface DeviceConfig {
  [il: string]: {
    [ges: string]: {
      [deviceType: string]: VariableConfig[];
    };
  };
}

/**
 * Dropdown data structure for device selection
 */
export type DropdownData = Record<string, Record<string, Record<string, VariableConfig[]>>>; 
export type GesDatabaseMapping = Record<string, string[]>; 
