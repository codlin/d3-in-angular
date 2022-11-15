import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { StackedData } from './interface';
import {
  removeExistingChart,
  StackedBarChart,
  StackedBarChartData,
} from './stacked-bar-chart';

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
  @Input() stackedData!: StackedData;

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
    if (changes['stackedData']) {
      this.createChart();
    }
  }

  private createChart() {
    removeExistingChart(this.hostElement);

    this.svg = StackedBarChart(
      this.stackedData.data(),
      {
        x: this.stackedData.x,
        y: this.stackedData.y,
        z: this.stackedData.z,
      } as StackedBarChartData,
      this.hostElement
    );
  }
  public updateChart(data: any[]) {
    if (!this.svg) {
      this.createChart();
      return;
    }
  }
}
