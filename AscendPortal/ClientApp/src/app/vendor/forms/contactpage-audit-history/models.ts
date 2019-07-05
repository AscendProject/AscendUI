export interface IVendorHistory {
  propertyName: string;
  newValue: string;
  oldValue: string;
  timestamp: string;
  partitionKey: string;
  rowKey: string;
  eTag: string;
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
