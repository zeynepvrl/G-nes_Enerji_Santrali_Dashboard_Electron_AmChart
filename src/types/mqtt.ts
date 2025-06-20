/**
 * Processed MQTT data interface
 */
export interface ProcessedMqttData {
  timestamp: number;
  value: number;
  raw?: unknown;
}

/**
 * MQTT data callback function type
 */
export type MqttDataCallback = (data: string, topic?: string) => void;

/**
 * MQTT unsubscribe function type
 */
export type MqttUnsubscribe = () => void;

/**
 * MQTT topic structure
 */
export interface MqttTopic {
  il: string;
  ges: string;
  deviceGroup: string;
  device: string;
}

/**
 * MQTT topic string format
 */
export type MqttTopicString = `${string}/${string}/${string}/${string}`; 