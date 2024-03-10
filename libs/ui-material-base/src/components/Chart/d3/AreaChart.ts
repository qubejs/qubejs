import * as d3 from 'd3';
import BaseChart from './Base';
class AreaChart extends BaseChart {
  tooltip:any;
  focus:any;
  element:any;
  d3:any;
  svg:any;
  t:any;
  x:any;
  y:any;
  data:any;
  g:any;
  xAxis:any;
  xAxisCall:any;
  yAxis:any;
  yAxisCall:any;
  defs:any;
  legend:any;
  area:any;
  line:any;
  overlay:any;
  lgN:any;
  tooltipEl:any;
  bisectDate:any;
  formatTime:any;
  parseTime:any;
  lg:any;
  constructor(el, options = {}) {
    super(
      el,
      {
        chart: options,
        chartType: 'AreaChart',
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

  resetWidth() {
    this.svg.attr('class', 'chart-svg').attr('width', 'auto');
  }

  update() {
    const d3 = this.d3;
    const vis = this;
    
    const element = this.element;
    const {
      xValue,
      margin,
      series = [],
      colorSet,
      xAxis = {},
      yAxis = {},
      tooltip = {},
      legendLabelWidth = 100,
    }:any = this.config;
    const { format: xAxisFormatter, type: xAxisDataType } = xAxis;
    const { labelWidth = 80, format: yAxisFormatter, minValue: yAxisMinValue } = yAxis;
    const { formatter: tooltipFormatter = (v) => v } = tooltip;
    vis.svg.attr('class', 'chart-svg').attr('width', 'auto');
    const { width, height, innerWidth, innerHeight }:any = this.getWidth();
    vis.t = d3.transition().duration(1000);
    vis.x = d3.scaleTime().range([0, innerWidth]);
    vis.y = d3.scaleLinear().range([innerHeight, 0]);
    vis.data = vis.data.map((item) => {
      return {
        ...item,
        [xValue]: xAxisDataType === 'date' && !(item[xValue] instanceof Date) ? new Date(item[xValue]) : item[xValue],
      };
    });
    const allValues = this.getValuesFromSeries(vis.data);
    const scale = 1.005;
    let minValue = d3.min(allValues, (d) => d) * scale;
    const maxValue = d3.max(allValues, (d) => d) * scale;
    if (yAxisMinValue !== undefined && minValue > yAxisMinValue) {
      minValue = yAxisMinValue;
    }

    vis.x.domain(d3.extent(vis.data, (d) => d[xValue]));
    vis.y.domain([minValue, maxValue]);

    vis.svg.attr('class', 'chart-svg').attr('width', width).attr('height', height);
    vis.g.attr('transform', `translate(${margin.left}, ${margin.top})`);

    vis.xAxis.attr('transform', `translate(0, ${innerHeight})`);
    // update axes
    const xTicksCount = innerWidth / labelWidth;
    vis.xAxisCall.ticks(xTicksCount > vis.data.length ? vis.data.length + 1 : xTicksCount);
    vis.xAxisCall.scale(vis.x);
    vis.xAxis.transition(vis.t).call(vis.xAxisCall.tickFormat(xAxisFormatter));
    vis.yAxisCall.scale(vis.y);
    vis.yAxis.transition(vis.t).call(vis.yAxisCall.tickFormat(yAxisFormatter));

    // clear old tooltips
    vis.g.select('.focus').remove();
    vis.g.select('.overlay').remove();

    /******************************** Tooltip Code ********************************/
    vis.focus = {};
    vis.focus.main = vis.g.append('g').attr('class', `focus`).style('display', 'none');
    vis.focus.main.append('line').attr('class', 'x-hover-line hover-line').attr('y1', 0).attr('y2', innerHeight);
    // vis.focus.main.append('rect').attr('class', 'x-tooltip').attr('y1', 0).attr('y2', innerHeight)
    // vis.focus.main.select('rect').attr('fill', '#fff').append('text').texchart('Test');
    series.forEach((ser) => {
      vis.focus[ser.name] = vis.focus.main.append('g').attr('class', `circle-data ${ser.name}`);
      vis.focus[ser.name]
        .append('circle')
        .attr('r', 5.5)
        .attr('class', `sq-line-chart-circle`)
        .style('stroke', ser.color);
      // vis.focus[ser.name].append('text').attr('x', 15).attr('dy', '.31em').attr('class', `sq-line-chart-t-text`);
    });

    vis.overlay
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .on('mouseover', () => this.showAllFocus())
      .on('mouseout', () => this.hideAllFocus())
      .on('mousemove', mousemove);

    function mousemove(e) {
      const x0 = vis.x.invert(d3.pointer(e)[0]);
      const bisectDate = d3.bisector(function (d, x) {
        return d[xValue] - x;
      }).left;
      const i = bisectDate(vis.data, x0);
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
        vis.focus[ser.name]
          .select('circle')
          .attr('cy', vis.y(d[ser.yValue] || 0))
          .style('stroke', d[ser.yValue] < 0 ? ser.negativeColor : ser.color);
        // vis.focus[ser.name].select('text').attr('y', vis.y(d[ser.yValue]));
        // vis.focus[ser.name].select('text').text(tooltipFormatter(d[ser.yValue]));
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
    /******************************** End Legend Code ********************************/
    const pos_height = vis.y(0);
    const neg_height = vis.y(minValue);
    vis.defs
      .select(`#clip_pos`)
      .select('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', innerWidth)
      .attr('height', pos_height > 0 ? pos_height : 0);
    vis.defs
      .select(`#clip_neg`)
      .select('rect')
      .attr('x', 0)
      .attr('y', vis.y(maxValue > 0 ? 0 : maxValue))
      .attr('width', innerWidth)
      .attr('height', neg_height > 0 ? neg_height : 0);
    // Path generator

    // Update our line path
    series.forEach((ser) => {
      vis.line = d3
        .line()
        // .curve(d3.curveCardinal)
        .x((d) => vis.x(d[xValue]))
        .y((d) => vis.y(d[ser.yValue] || 0));
      vis.area = d3
        .area()
        // .curve(d3.curveCardinal)
        .x((d) => vis.x(d[xValue]))
        .y0((d) => vis.y(minValue > 0 ? minValue : 0))
        .y1((d) => vis.y(d[ser.yValue] || 0));

      vis.g
        .select(`.area.p-${ser.name}`)
        .attr('stroke', 'none')
        .transition(vis.t)
        .attr('d', vis.area(vis.data))
        .style('clip-path', 'url(#clip_pos)');
      vis.g
        .select(`.area.n-${ser.name}`)
        .attr('stroke', 'none')
        .transition(vis.t)
        .attr('d', vis.area(vis.data))
        .style('clip-path', 'url(#clip_neg)');
      vis.g
        .select(`.line.${ser.name}`)
        .attr('stroke', ser.color)
        .transition(vis.t)
        .attr('d', vis.line(vis.data))
        .style('clip-path', 'url(#clip_pos)');
      vis.g
        .select(`.line-n.${ser.name}`)
        .attr('stroke', ser.negativeColor)
        .transition(vis.t)
        .attr('d', vis.line(vis.data))
        .style('clip-path', 'url(#clip_neg)');
    });
  }

  draw() {
    
    const vis = this;
    const element = this.element;

    const d3 = this.d3;
    const { xValue, margin, yAxisLabel, xAxisLabel, series = [], xAxis = {} } = this.config;
    const { type: xAxisDataType } = xAxis;
    const { width, height, innerWidth, innerHeight } = this.getWidth();
    const svg = d3.select(element).append('svg');
    const g = svg.append('g');

    this.svg = svg;
    this.tooltipEl = d3.select(element).append('div').attr('class', 'sq-chart-d-tooltip');
    this.legend = g.append('g').attr('class', 'sq-chart-legend');
    vis.g = g;
    vis.parseTime = d3.timeParse('%d/%m/%Y');
    vis.formatTime = d3.timeFormat('%d/%m/%Y');
    // for tooltip
    vis.bisectDate = d3.bisector((d) => d[xValue]).left;
    vis.defs = svg.append('defs');

    series.forEach((ser) => {
      const { strokeWidth = '3px' } = ser;
      vis.g
        .append('path')
        .attr('class', `area n-${ser.name}`)
        .attr('fill', `url(#gradN${ser.name})`)
        .attr('stroke', 'grey')
        .attr('stroke-width', strokeWidth);
      vis.g
        .append('path')
        .attr('class', `area p-${ser.name}`)
        .attr('fill', `url(#grad${ser.name})`)
        .attr('stroke', 'grey')
        .attr('stroke-width', strokeWidth);
      vis.g
        .append('path')
        .attr('class', `line ${ser.name}`)
        .attr('fill', 'none')
        .attr('stroke', 'grey')
        .attr('stroke-width', strokeWidth);
      vis.g
        .append('path')
        .attr('class', `line-n ${ser.name}`)
        .attr('fill', 'none')
        .attr('stroke', 'grey')
        .attr('stroke-width', strokeWidth);
      vis.lg = vis.defs
        .append('linearGradient')
        .attr('id', `grad${ser.name}`)
        .attr('x1', '0%')
        .attr('x2', '0%')
        .attr('y1', '0%')
        .attr('y2', '100%');
      vis.lg.append('stop').attr('offset', '0%').style('stop-color', ser.color).style('stop-opacity', 0.4);
      vis.lg.append('stop').attr('offset', '100%').style('stop-color', 'white').style('stop-opacity', 0.4);

      vis.lgN = vis.defs
        .append('linearGradient')
        .attr('id', `gradN${ser.name}`)
        .attr('x1', '0%')
        .attr('x2', '0%')
        .attr('y1', '0%')
        .attr('y2', '100%');
      vis.lgN.append('stop').attr('offset', '0%').style('stop-color', 'white').style('stop-opacity', 0.4);
      vis.lgN.append('stop').attr('offset', '100%').style('stop-color', ser.negativeColor).style('stop-opacity', 0.4);
    });
    vis.defs
      .append('clipPath')
      .attr('id', `clip_pos`)
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', innerWidth);
    vis.defs
      .append('clipPath')
      .attr('id', `clip_neg`)
      .append('rect')
      .attr('x', 0)
      .attr('y', 200)
      .attr('width', innerWidth);
    this.legend = g.append('g').attr('class', 'sq-chart-legend');
    // axis generators
    vis.xAxisCall = d3.axisBottom();
    vis.yAxisCall = d3.axisLeft().ticks(6);
    vis.overlay = vis.g.append('rect').attr('class', 'sq-chart-overlay');
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

export default AreaChart;
