export declare interface StackedBarChartData {
  x: (d: any, i: any) => any; // given d in data, returns the (ordinal) x-value
  y: (d: any, i: any) => any; // given d in data, returns the (quantitative) y-value
  z: (d: any, i: any) => any; // given d in data, returns the (categorical) z-value
  title: (d: any) => any; // given d in data, returns the title text
  marginTop: number; // top margin, in pixels
  marginRight: number; // right margin, in pixels
  marginBottom: number; // bottom margin, in pixels
  marginLeft: number; // left margin, in pixels
  width: number; // outer width, in pixels
  height: number; // outer height, in pixels
  xDomain: any[]; // array of x-values
  xPadding: number; // amount of x-range to reserve to separate bars
  xTick: boolean;
  yDomain: [number, number]; // [ymin, ymax]
  yTick: boolean;
  zDomain: any[]; // array of z-values
  yFormat: string; // a format specifier string for the y-axis
  yLabel: string; // a label for the y-axis
  colors: readonly string[];
}
