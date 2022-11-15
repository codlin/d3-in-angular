import * as d3 from 'd3';

export declare interface StackedBarChartData {
  x: (d: any, i: number) => any; // given d in data, returns the (ordinal) x-value
  y: (d: any, i: number) => any; // given d in data, returns the (quantitative) y-value
  z: (d: any, i: number) => any; // given d in data, returns the (categorical) z-value
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
  yFormat: string; // a format specifier string for the y-axis
  yLabel: string; // a label for the y-axis
  zDomain: any[]; // array of z-values
  colors: readonly string[];
}

export function StackedBarChart(
  data: any[],
  {
    x, // given d in data, returns the (ordinal) x-value
    y, // given d in data, returns the (quantitative) y-value
    z, // given d in data, returns the (categorical) z-value
    title, // given d in data, returns the title text
    marginTop = 30, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 30, // left margin, in pixels
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    xDomain, // array of x-values
    xPadding = 0.1, // amount of x-range to reserve to separate bars
    xTick = false,
    yDomain, // [ymin, ymax]
    zDomain, // array of z-values
    yFormat, // a format specifier string for the y-axis
    yLabel, // a label for the y-axis
    yTick = true,
    colors = d3.schemeTableau10,
  }: StackedBarChartData,
  hostElement: any
) {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const Z = d3.map(data, z);

  // Compute default x- and z-domains, and unique them.
  if (xDomain === undefined) {
    xDomain = Array.from(new d3.InternSet(X)).sort();
    console.log('xDomain', xDomain);
  }
  if (zDomain === undefined) {
    zDomain = Array.from(new d3.InternSet(Z)).sort();
    console.log('zDomain', zDomain);
  }
  if (yDomain === undefined) {
    yDomain = [0, Math.ceil(Math.max(...Y) * 1.2)];
    console.log('yDomain', yDomain);
  }

  // Compute default x- and z-domains, and unique them.
  let xRange = [marginLeft, width - marginRight]; // [left, right]
  console.log('xRange', xRange);

  let yRange = [height - marginBottom, marginTop]; // [bottom, top]
  console.log('yRange', yRange);

  // Construct scales, axes, and formats.
  const xScale = d3.scaleBand(xDomain, xRange).paddingInner(xPadding);
  const yScale = d3.scaleLinear(yDomain, yRange).nice();
  const color = d3.scaleOrdinal(zDomain, colors);

  const svg = d3
    .select(hostElement)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    // .attr('viewBox', [0, 0, 100, 200]);
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

  // create X axis
  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);

  // create Y axis
  const yAxis = d3.axisLeft(yScale).ticks(5, yFormat);

  // translate chart
  svg.append('g').attr('transform', `translate(${marginLeft}, ${marginTop})`);

  // translate Y axis
  const gY = svg
    .append('g')
    .attr('transform', `translate(${marginLeft},0)`)
    .call(yAxis)
    .call((g) =>
      g
        .append('text')
        .attr('x', -marginLeft)
        .attr('y', 10)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'start')
        .text(yLabel)
    );

  if (yTick) {
    gY.call((g) =>
      g
        .selectAll('.tick line')
        .clone()
        .attr('x2', width - marginLeft - marginRight)
        .attr('stroke-width', 0.1)
        .attr('stroke-opacity', 0.6)
    );
  }

  // translate X axis
  const gX = svg
    .append('g')
    .attr('transform', `translate(0, ${yScale(0)})`)
    .call(xAxis);

  if (xTick) {
    gX.call((g) =>
      g
        .selectAll('.tick line')
        .clone()
        .attr('y2', -height + marginTop + marginBottom)
        .attr('stroke-width', 0.1)
        .attr('stroke-opacity', 0.6)
    );
  }
  const stackedData = d3.stack().keys(['type', 'count'])(data);
  console.log(stackedData);
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

  if (title) bar.append('title').text((d) => title(d));

  return svg;
}

export function removeExistingChart(hostElement: any) {
  // !!!!Caution!!!
  // Make sure not to do;
  //     d3.select('svg').remove();
  // That will clear all other SVG elements in the DOM
  d3.select(hostElement).select('svg').remove();
}
