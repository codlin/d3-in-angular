import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ChartData, Data, stackColor } from './stacked-bar-chart/interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'd3-in-angular';
  @ViewChild('stackedBarChart', { static: true })
  // chart!: StackedBarChartComponent;
  chartData!: ChartData;
  constructor(private http: HttpClient) {
    this.http.get('/api/bar-chart').subscribe((res: any) => {
      console.log(res);
      const data = res.data.frontend;
      const items: Data[] = [];
      const bandwiths = Object.keys(data);
      bandwiths.forEach((bw) => {
        const branch = data[bw]['SBTS00'];
        items.push({
          x: bw,
          z1: branch['bts_count'],
          z2: branch['cell_count'],
        } as Data);
      });
      console.log(items);
      this.chartData = {
        items,
        colums: ['x', 'z1', 'z2'],
        colors: { z1: '#ffff00', z2: '#00ff00' } as stackColor,
      };
    });
  }
}
