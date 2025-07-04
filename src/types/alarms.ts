export interface Measurement {
  name: string;
  WERT: number;
  DATUMZEIT: string;
  isSpontaneous: boolean;
  isOutage: boolean;
}

export interface Limit {
  name: string;
  limit_value: number;
} 