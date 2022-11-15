import { StackedData } from './stacked-bar-chart/interface';

export class TestStackedData implements StackedData {
  x: (d: any, i: number) => any;
  y: (d: any, i: number) => any;
  z: (d: any, i: number) => any;
  data: () => any;

  _data: any[] = [];

  constructor(stackedData: any[]) {
    this._data = stackedData;

    this.x = (d: any) => {
      return d.bandwdith;
    };
    this.y = (d: any) => {
      return d.count;
    };
    this.z = (d: any) => {
      return d.type;
    };
    this.data = () => {
      return this._data;
    };
  }
}
