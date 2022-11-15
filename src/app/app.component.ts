import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { StackedBarChartComponent } from './stacked-bar-chart/stacked-bar-chart.component';
import { TestStackedData } from './app.data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'd3-in-angular';
  @ViewChild('stackedBarChart', { static: true })
  // chart!: StackedBarChartComponent;
  chartData!: TestStackedData;
  constructor(private http: HttpClient) {
    this.http.get('/api/bar-chart').subscribe((res: any) => {
      console.log(res);
      const data = res.data.frontend;
      const stackdata: any[] = [];
      const bandwiths = Object.keys(data);
      bandwiths.forEach((bw) => {
        const branch = data[bw]['SBTS00'];
        stackdata.push({
          bandwdith: bw,
          count: branch['bts_count'],
          type: 'bts',
        });
        stackdata.push({
          bandwdith: bw,
          count: branch['cell_count'],
          type: 'cell',
        });
      });
      console.log(stackdata);
      this.chartData = new TestStackedData(stackdata);
    });
  }
}
