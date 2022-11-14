import * as d3 from 'd3';
import { StackedBarChartData } from './interface';

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
    xTick = true,
    yDomain, // [ymin, ymax]
    zDomain, // array of z-values
    yFormat, // a format specifier string for the y-axis
    yLabel, // a label for the y-axis
    yTick = false,
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
  }
  if (zDomain === undefined) {
    zDomain = Array.from(new d3.InternSet(Z)).sort();
  }
  if (yDomain === undefined) {
    yDomain = [0, Math.ceil(Math.max(...Y) * 1.2)];
  }

  // Compute default x- and z-domains, and unique them.
  let xRange = [marginLeft, width - marginRight]; // [left, right]
  let yRange = [height - marginBottom, marginTop]; // [bottom, top]

  // Construct scales, axes, and formats.
  const xScale = d3.scaleBand(xDomain, xRange).paddingInner(xPadding);
  const yScale = d3.scaleLinear(yDomain, yRange).nice();
  const color = d3.scaleOrdinal(zDomain, colors);

  const svg = d3
    .select(hostElement)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

  // create X axis
  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);

  // create Y axis
  const yAxis = d3.axisLeft(yScale).ticks(height / 10, yFormat);

  // translate chart
  svg.append('g').attr('transform', `translate(${marginLeft}, ${marginTop})`);

  // translate Y axis
  const gY = svg
    .append('g')
    .attr('transform', `tanslate(${marginLeft},0)`)
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
    .attr('transform', `tanslate(0, ${yScale(0)})`)
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

  const stackedData = d3.stack().keys(zDomain)(data);
  const bar = svg
    .append('g')
    .selectAll('g')
    .data(stackedData)
    .join('g')
    .attr('fill', (d) => color(d.key))
    .selectAll('rect')
    .data((d) => d)
    .join('rect')
    .attr('x', (_, i) => xScale(X[i]) ?? 0)
    .attr('y', ([y1, y2]) => Math.min(yScale(y1), yScale(y2)))
    .attr('height', ([y1, y2]) => Math.abs(yScale(y1) - yScale(y2)))
    .attr('width', xScale.bandwidth());

  if (title) bar.append('title').text((d) => title(d));

  return svg.node();
}
