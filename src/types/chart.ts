/**
 * Chart data point interface for time series data
 */
export interface ChartDataPoint {
  timestamp: number;
  value: number;
}

/**
 * Candlestick data interface for OHLCV data
 */
export interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Time interval configuration for chart data aggregation
 */
export interface TimeInterval {
  timeUnit: "minute" | "hour";
  count: number;
}

/**
 * Chart type options for data visualization
 */
export type ChartType = 'candlestick' | 'line';

/**
 * Chart data request parameters for worker processing
 */
export interface ChartDataRequest {
  data: ChartDataPoint[];
  timeUnit: TimeInterval['timeUnit'];
  count: number;
  chartType: ChartType;
} 