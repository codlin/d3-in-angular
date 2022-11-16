export declare interface Data {
  x: string;
  z1: number;
  z2: number;
}
export type stackColor = {
  [k: string]: string;
};

export declare interface ChartData {
  items: Data[];
  colums: string[];
  colors: stackColor;
}
