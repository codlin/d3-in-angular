import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';

import {
  axisBottom,
  axisLeft,
  scaleBand,
  scaleLinear,
  scaleOrdinal,
  schemeTableau10,
  select,
} from 'd3';
import { StackedBarChartData } from './interface';

@Component({
  selector: 'app-stacked-bar-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './stacked-bar-chart.component.html',
  styleUrls: ['./stacked-bar-chart.component.scss'],
})
export class StackedBarChartComponent implements OnInit, OnChanges {
  @Input() height = 50; // chart default height
  @Input() width = 100; // chart default width
  @Input() margin = { top: 0, right: 0, bottom: 0, left: 0 }; // margin for chart
  @Input() xTick = true; // chart show horizontal lines
  @Input() yTick = false; // chart show vertical lines
  @Input() data!: StackedBarChartData;

  hostElement: any; // Native element hosting the SVG container
  // svg: any;
  // xAxis!: any;
  // yAxis!: any;

  constructor(private elRef: ElementRef) {
    this.hostElement = this.elRef.nativeElement;
  }

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
    }
  }

  // private get xmax() {
  //   return this.width - this.margin.left - this.margin.right;
  // }

  // private get ymax() {
  //   return this.height - this.margin.top - this.margin.bottom;
  // }

  private createChart() {
    // Construct scales, axes, and formats.
    const xDomain = this.data.xDomain();
    const xRange = [this.margin.left, this.width - this.margin.right];
    const xScale = scaleBand(xDomain, xRange).paddingInner(0.1);
    const yDomain = this.data.yDomain();
    const yRange = [this.height - this.margin.bottom, this.margin.top];
    const yScale = scaleLinear(yDomain, yRange);
    const colors = scaleOrdinal(
      this.data.zDomain(),
      this.data.zColors() ?? schemeTableau10
    );

    // create X axis
    const xAxis = axisBottom(xScale).tickSizeOuter(0);
    // this.xAxis = xAxis;

    // create Y axis
    const yAxis = axisLeft(yScale).ticks(this.height / 10);
    // this.yAxis = yAxis;

    let svg = select(this.hostElement)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', [0, 0, this.width, this.height]);

    // translate chart
    svg
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // translate Y axis
    const gY = svg
      .append('g')
      .attr('transform', `tanslate(${this.margin.left},0)`)
      .call(yAxis)
      .call((g) =>
        g
          .append('text')
          .attr('x', -this.margin.left)
          .attr('y', 10)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'start')
          .text(this.data.yLable())
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
      .attr('transform', `tanslate(0, ${yScale(0)})`)
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

    // this.svg = svg;
  }
}
