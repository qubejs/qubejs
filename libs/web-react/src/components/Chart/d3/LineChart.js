import BaseChart from './Base';
import common from '../../../utils/common';

class LineChart extends BaseChart {
  constructor(el, options = {}) {
    super(
      el,
      {
        chart: options,
        chartType: 'LineChart',
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

  refresh() {
    this.update();
  }

  hideAllFocus() {
    const { series } = this.config;
    this.focus.main.style('display', 'none');
    const tooltip = d3.select(this.element).select('.sq-chart-d-tooltip');
    tooltip.style('opacity', '0');
  }

  showAllFocus() {
    const { series } = this.config;
    this.focus.main.style('display', null);
    series.forEach((ser) => {});
  }

  update() {
    const d3 = this.d3;
    const vis = this;
    const element = this.element;
    var { xValue, margin, series = [], colorSet, yAxis = {}, xAxis = {}, tooltip = {}, legendLabelWidth = 100 } = this.config;
    const { type: xAxisDataType } = xAxis;
    const { format: yAxisFormatter } = yAxis;
    const { formatter: tooltipFormatter = (v) => v } = tooltip;
    var { width, height, innerWidth, innerHeight } = this.getWidth();
    vis.t = d3.transition().duration(1000);
    vis.x = d3.scaleUtc().range([0, innerWidth]);
    vis.y = d3.scaleLinear().range([innerHeight, 0]);
    vis.data = vis.data.map((item) => {
      return {
        ...item,
        [xValue]: xAxisDataType === 'date' && !(item[xValue] instanceof Date) ? new Date(item[xValue]) : item[xValue],
      };
    });
    let allValues = this.getValuesFromSeries(vis.data);

    vis.x.domain(d3.extent(vis.data, (d) => d[xValue]));
    vis.y.domain([d3.min(allValues, (d) => d) / 1.005, d3.max(allValues, (d) => d) * 1.005]);

    vis.svg.attr('class', 'chart-svg').attr('width', width).attr('height', height);
    vis.g.attr('transform', `translate(${margin.left}, ${margin.top})`);

    vis.xAxis.attr('transform', `translate(0, ${innerHeight})`);
    // update axes
    vis.xAxisCall.scale(vis.x);
    vis.xAxis.transition(vis.t).call(vis.xAxisCall);
    vis.yAxisCall.scale(vis.y);
    vis.yAxis.transition(vis.t).call(vis.yAxisCall.tickFormat(yAxisFormatter));

    // clear old tooltips
    vis.g.select('.focus').remove();
    vis.g.select('.overlay').remove();

    /******************************** Tooltip Code ********************************/
    vis.focus = {};
    vis.focus.main = vis.g.append('g').attr('class', `focus`).style('display', 'none');
    vis.focus.main.append('line').attr('class', 'x-hover-line hover-line').attr('y1', 0).attr('y2', innerHeight);

    series.forEach((ser) => {
      vis.focus[ser.name] = vis.focus.main.append('g').attr('class', `circle-data ${ser.name}`);
      vis.focus[ser.name].append('circle').attr('r', 7.5).attr('class', `sq-line-chart-circle`).style('stroke', ser.color);
      vis.focus[ser.name].append('text').attr('x', 15).attr('dy', '.31em').attr('class', `sq-line-chart-t-text`);
    });

    vis.g
      .append('rect')
      .attr('class', 'sq-chart-overlay')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .on('mouseover', () => this.showAllFocus())
      .on('mouseout', () => this.hideAllFocus())
      .on('mousemove', mousemove);

    function mousemove(e) {
      const x0 = vis.x.invert(d3.pointer(e)[0]);
      const i = vis.bisectDate(vis.data, x0, 1);
      const d0 = vis.data[i > 0 ? i - 1 : 0];
      const d1 = vis.data[i >= vis.data.length ? vis.data.length - 1 : i];
      const d = x0 - d0[xValue] > d1[xValue] - x0 ? d1 : d0;
      vis.focus.main.attr('transform', `translate(${vis.x(d[xValue])},0 )`);
      vis.focus.main.select('.x-hover-line').attr('y2', innerHeight);
      const tooltip = d3.select(vis.element).select('.sq-chart-d-tooltip');
      tooltip.html(tooltipFormatter(e, d, series));
      tooltip.style('left', `${vis.x(d[xValue])}px`);
      tooltip.style('opacity', `1`);
      tooltip.style('top', `0px`);
      series.forEach((ser) => {
        vis.focus[ser.name].select('circle').attr('cy', vis.y(d[ser.yValue]));
        vis.focus[ser.name].select('text').attr('y', vis.y(d[ser.yValue]));
        vis.focus[ser.name].select('text').html(tooltipFormatter(d[ser.yValue], d));
      });
    }

    /******************************** Legend Code ********************************/
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
        var color = d.color;
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
        var text = d.label || d.name;
        return text;
      });
    /******************************** End Legend Code ********************************/

    // Path generator
    // Update our line path
    series.forEach((ser) => {

      vis.line = d3
        .line()
        // .curve(d3.curveLinear)
        .x((d) => {
          return !common.isNullOrUndefined(d[xValue]) ? vis.x(d[xValue]) : null;
        })
        .y((d) => {
          return !common.isNullOrUndefined(d[ser.yValue]) ? vis.y(d[ser.yValue]) : null;
        });
      vis.g.select(`.line.${ser.name}`).attr('stroke', ser.color).attr('d', vis.line(vis.data));
    });
  }

  draw() {
    const vis = this;
    const element = this.element;
    const d3 = this.d3;
    var { xValue, margin, yAxisLabel, xAxisLabel, series = [] } = this.config;
    var { width, height, innerWidth, innerHeight } = this.getWidth();
    const svg = d3.select(element).append('svg');
    const g = svg.append('g');

    this.svg = svg;

    this.legend = g.append('g').attr('class', 'sq-chart-legend');
    vis.g = g;
    vis.parseTime = d3.timeParse('%d/%m/%Y');
    vis.formatTime = d3.timeFormat('%d/%m/%Y');
    // for tooltip
    vis.bisectDate = d3.bisector((d) => d[xValue]).left;

    series.forEach((ser) => {
      const { strokeWidth = '3px' } = ser;
      vis.g.append('path').attr('class', `line ${ser.name}`).attr('fill', 'none').attr('stroke', 'grey').attr('stroke-width', strokeWidth);
    });
    this.legend = g.append('g').attr('class', 'sq-chart-legend');
    this.tooltipEl = d3.select(element).append('div').attr('class', 'sq-chart-d-tooltip');
    // axis generators
    vis.xAxisCall = d3.axisBottom();
    vis.yAxisCall = d3.axisLeft().ticks(6);

    // axis groups
    vis.xAxis = vis.g.append('g').attr('class', 'x axis');

    vis.yAxis = vis.g.append('g').attr('class', 'y axis');

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

export default LineChart;
