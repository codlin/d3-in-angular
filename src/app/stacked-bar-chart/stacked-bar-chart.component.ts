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
  stack,
} from 'd3';
import { StackedBarChartData } from './interface';

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

  private createChart() {}
}
