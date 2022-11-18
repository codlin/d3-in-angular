import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import * as d3 from 'd3';
import { schemeDark2 } from 'd3';
import { fromEvent } from 'rxjs';

import { ChartData, Data, stackColor } from './interface';
import { removeExistingChart } from './stacked-bar-chart';

@Component({
  selector: 'app-stacked-bar-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './stacked-bar-chart.component.html',
  styleUrls: ['./stacked-bar-chart.component.scss'],
})
export class StackedBarChartComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @Input() height = 300; // chart default height
  @Input() width = 500; // chart default width
  @Input() margin = { top: 30, right: 30, bottom: 30, left: 30 }; // margin for chart
  @Input() xTick = true; // chart show horizontal lines
  @Input() yTick = true; // chart show vertical lines
  @Input() title!: string;
  data!: ChartData;

  @ViewChild('stackedBarChart') chart!: ElementRef;
  tipTitle: string = '';
  typeName = '';
  typeValue = 0;

  hostElement: any; // Native element hosting the SVG container
  yAxis: any;
  xAxis: any;

  constructor(private http: HttpClient, private elRef: ElementRef) {
    console.log(elRef);
  }

  ngOnInit(): void {
    this.http.get('/api/bar-chart').subscribe((res: any) => {
      console.log(res);
      this.hostElement = this.chart.nativeElement;

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
      this.data = {
        items,
        colums: ['x', 'z1', 'z2'],
        colors: { z1: '#68C214', z2: '#fff633' } as stackColor,
      };
      this.createChart();
    });
  }

  ngAfterViewInit() {
    fromEvent(window, 'resize').subscribe((event) => {
      this.height = this.hostElement.offsetHeight;
      this.width = this.hostElement.offsetWidth;
      console.log(this.height, this.width);
      const svg = d3.select(this.hostElement).selectAll('svg');
      svg.transition().duration(1000);
      svg.select('.x.axis').transition().duration(1000).call(this.xAxis);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges', changes['data'].currentValue);
    if (changes['data'].currentValue?.items) {
      this.createChart();
    }
  }

  private createChart() {
    removeExistingChart(this.hostElement);

    // Compute values.
    console.log('===', this.data.items);
    const X = d3.map(this.data.items, (v) => v.x);
    const Y = d3.map(this.data.items, (v) => [v.z1, v.z2]);

    // Compute default x- and z-domains, and unique them.
    const xDomain = Array.from(new d3.InternSet(X)).sort();
    console.log('xDomain', xDomain);

    const zDomain = this.data.colums.slice(1);
    console.log('zDomain', zDomain);

    let ymax = Math.ceil(
      Math.max(...Y.map((v) => v.reduce((pre, curr) => pre + curr)))
    );
    // console.log('ymax', ymax);
    ymax = Math.floor(ymax / 10) * 10 + (ymax % 10 === 0 ? 0 : 10);
    // console.log('ymax', ymax);
    const yDomain = [0, ymax];
    console.log('yDomain', yDomain);

    // Compute default x- and z-domains, and unique them.
    let xRange = [this.margin.left, this.width - this.margin.right]; // [left, right]
    console.log('xRange', xRange);

    let yRange = [this.height - this.margin.bottom, this.margin.top]; // [bottom, top]
    console.log('yRange', yRange);

    const colors = Object.keys(this.data.colors).map(
      (k) => this.data.colors[k]
    );
    // Construct scales, axes, and formats.
    const xScale = d3.scaleBand(xDomain, xRange).padding(0.2);
    const yScale = d3.scaleLinear(yDomain, yRange).nice();
    const color = d3.scaleOrdinal(zDomain, colors);

    const svg = d3
      .select(this.hostElement)
      .append('svg')
      // .attr('width', this.width)
      // .attr('height', this.height);
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', [0, 0, this.width, this.height]);

    // create X axis
    const xAxis = d3.axisBottom(xScale).tickSize(2);
    this.xAxis = xAxis;

    // create Y axis
    const yAxis = d3.axisLeft(yScale).tickSize(2);
    this.yAxis = yAxis;

    // translate chart
    svg
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // translate Y axis
    const gY = svg
      .append('g')
      .attr('class', 'y axis')
      .attr('transform', `translate(${this.margin.left},0)`)
      .call(yAxis)
      .call(
        (g) =>
          g
            .append('text')
            .attr('x', -this.margin.left)
            .attr('y', 10)
            .attr('fill', 'currentColor')
            .attr('text-anchor', 'start')
        // .text(yLabel)
      );

    if (this.yTick) {
      gY.call((g) =>
        g
          .selectAll('.tick line')
          .clone()
          .attr('x2', this.width - this.margin.left - this.margin.right)
          .attr('stroke-width', 0.1)
          .attr('stroke-opacity', 0.4)
      );
    }

    // translate X axis
    const gX = svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${yScale(0)})`)
      .call(xAxis);

    if (this.xTick) {
      gX.call((g) =>
        g
          .selectAll('.tick line')
          .clone()
          .attr('y2', -this.height + this.margin.top + this.margin.bottom)
          .attr('stroke-width', 0.1)
          .attr('stroke-opacity', 0.4)
      );
    }

    // Omit any data not present in the x- and z-domains.
    const data: any = this.data.items;
    const stackedData = d3.stack().keys(zDomain)(data);
    console.log('stacked data', stackedData);

    const bar = svg
      .append('g')
      .selectAll('g')
      // Enter in the stack data = loop key per key = group per group
      .data(stackedData)
      .enter()
      .append('g')
      .attr('fill', (d) => color(d.key))
      .attr('fill-opacity', 0.75)
      .selectAll('rect')
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data((d) => {
        console.log(d);
        return d;
      })
      .enter()
      .append('rect')
      .attr('x', (d, i) => {
        console.log(d);
        return xScale(X[i]) as number;
      })
      .attr('y', ([, end]) => yScale(end))
      .attr('height', ([y1, y2]) => Math.abs(yScale(y1) - yScale(y2)))
      .attr('width', xScale.bandwidth())
      .on('mouseover', function (event, d) {
        console.log(event, d);
        let value = d[1] - d[0];
        let data = d['data'] as unknown as Data;
        d3.select('#tooltip').select('#title').text(data.x);
        d3.select('#tooltip').select('#values').text(value);
        // 显示提示条
        d3.select('#tooltip').classed('hidden', false);
      })
      .on('mousemove', function (event) {
        // 更新提示条的位置和值
        d3.select('#tooltip')
          .style('top', event.pageY - 10 + 'px')
          .style('left', event.pageX + 10 + 'px')
          .select('#value')
          .text(event);
      })
      .on('mouseout', function () {
        /// 隐藏提示条
        d3.select('#tooltip').classed('hidden', true);
      });

    if (this.title) bar.append('title').text(this.title);

    return svg;
  }
}
