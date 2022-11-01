import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';

import { axisBottom, axisLeft, scaleBand, scaleLinear, select } from 'd3';

export interface StackedBarChartData {
  xDomains(): string[];
}

@Component({
  selector: 'app-stacked-bar-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './stacked-bar-chart.component.html',
  styleUrls: ['./stacked-bar-chart.component.scss'],
})
export class StackedBarChartComponent implements OnInit, OnChanges {
  @Input() height = 50; // chart default height
  @Input() width = 100; // chart default width
  @Input() margin = { top: 0, right: 0, bottom: 0, left: 0 };
  @Input() data!: StackedBarChartData;

  hostElement: any; // Native element hosting the SVG container
  svg: any;
  x!: any; // X axis
  y!: any; // Y axis

  constructor(private elRef: ElementRef) {
    this.hostElement = this.elRef.nativeElement;
  }

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
    }
  }

  private get xmax() {
    return this.width - this.margin.left - this.margin.right;
  }

  private get ymax() {
    return this.height - this.margin.top - this.margin.bottom;
  }

  private createChart() {
    let svg = select(this.hostElement)
      .append('svg')
      .attr('height', this.height - this.margin.top - this.margin.bottom)
      .attr('width', this.width)
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    this.svg = svg;

    // create X axis
    const xDomains = this.data.xDomains();
    const xRange = [this.margin.left, this.width - this.margin.right];
    this.x = scaleBand(xDomains, xRange).paddingInner(0.1);
    svg
      .append('g')
      .attr('transform', `tanslate(0, ${this.ymax})`)
      .call(axisBottom(this.x).tickSizeOuter(0));

    // create Y axis
    this.y = scaleLinear()
      .domain([0, 60])
      .range([this.height - this.margin.bottom, this.margin.top]);
    svg.append('g').call(axisLeft(this.y));
  }
}
