import BaseChart from './Base';

class ColumnChart extends BaseChart {
  data: any;
  gContainer: any;
  tooltip: any;
  x: any;
  y: any;
  xAxisGroup: any;
  yAxisGroup: any;
  columnArea: any;
  lineArea: any;
  legend: any;
  constructor(el, options = {}) {
    super(
      el,
      {
        chart: options,
        chartType: 'ColumnChart',
      },
      {
        margin: {
          top: 20,
          bottom: 90,
          left: 60,
          right: 20,
        },
      }
    );
  }

  getConfig() {}

  init() {}

  resetWidth() {
    const d3 = this.d3;
    d3.select(this.element).select('svg').attr('width', 'auto');
  }
  refresh() {
    this.update();
  }

  update() {
    const d3 = this.d3;

    const element = this.element;
    const {
      colorSet,
      xAxis = {},
      yAxis,
      tooltip = {},
      legend = {},
    } = this.config;
    const { labelWidth: legendLabelWidth = 80, enable: legendEnabled = true }:{labelWidth: number, enable: boolean} =
      legend;
    const { format, ticks = 5 } = yAxis || {};
    const { labelWidth = 44 }: {labelWidth: number} = xAxis;
    const { formatter: formatTooltip = (d) => d[xValue] } = tooltip;
    const colorSetDefault = this.getColorSet(colorSet);
    const { xValue, series = [] } = this.config;
    const columnSeries = series.filter((t) => !t.type || t.type === 'Column');
    const lineSeries = series.filter((t) => t.type === 'Line');
    d3.select(element).select('svg').attr('width', 'auto');
    const { width, height, innerWidth, innerHeight } = this.getWidth();
    d3.select(element)
      .select('svg')
      .attr('width', width)
      .attr('height', height);
    if (!this.data) {
      return;
    }
    const data = this.data;

    const allValues = this.getValuesFromSeries(this.data);

    const x = d3
      .scaleBand()
      .range([0, innerWidth])
      .domain(data.map((d) => d[xValue]))
      .paddingInner(0.2)
      .paddingOuter(0.1);
    this.x = x;
    let minAll = d3.min(allValues, (d) => d);
    if (minAll > 0) {
      minAll = 0;
    }
    const y = d3
      .scaleLinear()
      .domain([minAll * 1.005, (d3.max(allValues, (d) => d) || 100) * 1.005])
      .range([innerHeight, 0]);
    this.y = y;

    const g = this.gContainer;
    this.tooltip.html(formatTooltip);

    const xAxisCall = d3.axisBottom(x);
    this.xAxisGroup
      .call(xAxisCall)
      .selectAll('text')
      .attr('y', '10')
      .attr('x', '-5')
      .attr('text-achor', 'end')
      .attr('transform', 'rotate(0)')
      .style('display', function (d, i) {
        const num:number = data.length / (innerWidth / (labelWidth + 20))
        const everyItem = Math.ceil(
          num
        );
        return i % everyItem ? 'none' : 'initial';
      });
    const yAxisCall = d3
      .axisLeft(y)
      .ticks(ticks)
      .tickFormat((d) => (format ? format(d) : d));
    this.yAxisGroup.call(yAxisCall);
    let slice = this.columnArea
      .selectAll('.group')
      .data(data, (d) => d[xValue]);
    slice.exit().remove();
    slice = slice
      .enter()
      .append('g')
      .merge(slice)
      .attr('class', 'group')
      .on('mouseover', this.tooltip.show)
      .on('mouseout', this.tooltip.hide);

    const rects = slice.selectAll('rect').data((d) => {
      return columnSeries.map((ser, idx) => {
        return {
          orig: ser,
          x: d[ser.xValue],
          y: d[ser.yValue],
          color: ser.color || colorSetDefault[idx],
        };
      });
    });
    function getX(d, idx) {
      return x(d.x) + (x.bandwidth(d.x) / columnSeries.length) * idx;
    }
    function getWidth(d) {
      return x.bandwidth(d.x) / columnSeries.length;
    }
    lineSeries.forEach((item) => {
      const line = d3
        .line()
        .x((d) => {
          return x(d[item.xValue]) + x.bandwidth(d.x) / columnSeries.length;
        })
        .y((d) => {
          return y(d[item.yValue]);
        });
      g.selectAll(`.${item.name}`)
        .transition(d3.transition().duration(750))
        .attr('d', line(data));
    });

    rects.exit().remove();
    if (legendEnabled) {
      const legRects = this.legend.selectAll('rect').data(series);
      const totalSeries = series.length;

      legRects
        .enter()
        .append('rect')
        .merge(legRects)
        .attr('x', function (d, i) {
          return innerWidth - (totalSeries - i) * legendLabelWidth;
        })
        .attr('y', function (d, i) {
          return height - 70;
        })
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', function (d) {
          const color = d.color;
          return color;
        });
      const legTexts = this.legend.selectAll('text').data(series);

      legTexts
        .enter()
        .append('text')
        .merge(legTexts)
        .attr('x', function (d, i) {
          return innerWidth - (totalSeries - i) * legendLabelWidth + 16;
        })
        .attr('y', function (d, i) {
          return height - 70;
        })
        .attr('alignment-baseline', 'hanging')
        .text(function (d) {
          const text = d.label || d.name;
          return text;
        });
    }
    rects
      .enter()
      .append('rect')
      .attr('fill', (d) => d.color)
      .attr('y', (d) => y(0))
      .attr('height', (d) => 0)
      .attr('width', getWidth)
      .merge(rects)
      .attr('x', getX)
      .transition(d3.transition().duration(750))
      .attr('width', getWidth)
      .attr('y', (d) => y(d.y))
      .attr('height', (d) => y(0) - y(d.y));
  }
  mousemoveTooltip(e) {}

  draw() {
    const element = this.element;
    const d3 = this.d3;
    const {
      yValue,
      xValue,
      margin,
      yAxisLabel,
      xAxisLabel,
      series = [],
    } = this.config;
    const lineSeries = series.filter((item) => item.type === 'Line');
    const { width, height, innerWidth, innerHeight }: any = this.getWidth();
    const svg = d3
      .select(element)
      .append('svg')
      .attr('class', 'chart-svg')
      .attr('width', width)
      .attr('height', height);
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    this.gContainer = g;
    this.xAxisGroup = g
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${innerHeight})`);
    this.yAxisGroup = g.append('g').attr('class', 'y axis');
    this.columnArea = g.append('g').attr('class', 'column');
    this.lineArea = g.append('g').attr('class', 'line');
    lineSeries.forEach((item) => {
      this.lineArea
        .append('path')
        .attr('class', item.name)
        .attr('fill', 'none')
        .attr('stroke', item.color)
        .attr('stroke-width', '3px');
    });

    this.legend = g.append('g').attr('class', 'sq-chart-legend');

    this.tooltip = d3.tip().attr('class', 'sq-chart-tooltip');
    g.call(this.tooltip);

    if (!this.data) {
      return;
    }
    this.update();
  }

  dispose() {
    this.tooltip && this.tooltip.destroy();
    this.element.innerHTML = '';
  }
}

export default ColumnChart;
