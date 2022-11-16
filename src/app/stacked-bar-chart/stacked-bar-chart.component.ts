import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import * as d3 from 'd3';

import { ChartData, stackColor } from './interface';
import { removeExistingChart } from './stacked-bar-chart';

@Component({
  selector: 'app-stacked-bar-chart',
  encapsulation: ViewEncapsulation.None,
  template: '<svg></svg>',
  styleUrls: ['./stacked-bar-chart.component.scss'],
})
export class StackedBarChartComponent implements OnInit, OnChanges {
  @Input() height = 50; // chart default height
  @Input() width = 100; // chart default width
  @Input() margin = { top: 0, right: 0, bottom: 0, left: 0 }; // margin for chart
  @Input() xTick = true; // chart show horizontal lines
  @Input() yTick = false; // chart show vertical lines
  @Input() title!: string;
  @Input() data: ChartData = {
    items: [],
    colums: [],
    colors: {} as stackColor,
  } as ChartData;

  hostElement: any; // Native element hosting the SVG container
  svg: any;
  // xAxis!: any;
  // yAxis!: any;

  constructor(private elRef: ElementRef) {
    console.log(elRef);
    this.hostElement = this.elRef.nativeElement;
  }

  ngOnInit(): void {
    // this.createChart();
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes['data']) {
      this.createChart();
    }
  }

  private createChart() {
    removeExistingChart(this.hostElement);

    // Compute values.
    const X = d3.map(this.data.items, (v) => v.x);
    const Y = d3.map(this.data.items, (v) => [v.z1, v.z2]);
    const Z = d3.map(this.data.colums, (v) => v.slice(1));

    // Compute default x- and z-domains, and unique them.
    const xDomain = Array.from(new d3.InternSet(X)).sort();
    console.log('xDomain', xDomain);

    const zDomain = Array.from(new d3.InternSet(Z)).sort();
    console.log('zDomain', zDomain);

    const yDomain = [
      0,
      Math.ceil(
        Math.max(...Y.map((v) => v.reduce((pre, curr) => pre + curr))) * 1.2
      ),
    ];
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
    const xScale = d3.scaleBand(xDomain, xRange).paddingInner(0.1);
    const yScale = d3.scaleLinear(yDomain, yRange).nice();
    const color = d3.scaleOrdinal(zDomain, colors);

    const svg = d3
      .select(this.hostElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      // .attr('viewBox', [0, 0, 100, 200]);
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

    // create X axis
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);

    // create Y axis
    const yAxis = d3.axisLeft(yScale).ticks(5);

    // translate chart
    svg
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // translate Y axis
    const gY = svg
      .append('g')
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
          .attr('stroke-opacity', 0.6)
      );
    }

    // translate X axis
    const gX = svg
      .append('g')
      .attr('transform', `translate(0, ${yScale(0)})`)
      .call(xAxis);

    if (this.xTick) {
      gX.call((g) =>
        g
          .selectAll('.tick line')
          .clone()
          .attr('y2', -this.height + this.margin.top + this.margin.bottom)
          .attr('stroke-width', 0.1)
          .attr('stroke-opacity', 0.6)
      );
    }

    // Omit any data not present in the x- and z-domains.
    const data: any = this.data.items;
    const stackedData = d3.stack().keys(zDomain)(data);

    const bar = svg
      .append('g')
      .selectAll('g')
      .data(stackedData)
      .join('g')
      .attr('fill', (d) => color(d.key))
      .selectAll('rect')
      .data((d) => {
        // console.log(d);
        return d;
      })
      .join('rect')
      .attr('x', (_, i) => xScale(X[i]) ?? 0)
      .attr('y', ([, end]) => {
        // console.log(end);
        return yScale(end);
      })
      .attr('height', ([y1, y2]) => Math.abs(yScale(y1) - yScale(y2)))
      .attr('width', xScale.bandwidth());

    if (this.title) bar.append('title').text(this.title);

    return svg;
  }
  public updateChart(data: any[]) {
    if (!this.svg) {
      this.createChart();
      return;
    }
  }
}
