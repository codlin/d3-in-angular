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

export declare interface Tips {
  color: string;
  key: string;
  value: string;
}
export declare interface CharToolTip {
  title: string;
  items: Tips[];
}