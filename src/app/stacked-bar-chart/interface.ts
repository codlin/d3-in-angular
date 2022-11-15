export declare interface StackedData {
  x: (d: any, i: any) => any; // given d in data, returns the (ordinal) x-value
  y: (d: any, i: any) => any; // given d in data, returns the (quantitative) y-value
  z: (d: any, i: any) => any; // given d in data, returns the (categorical) z-value
  data: () => any;
}
