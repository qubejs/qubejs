import BaseChart from './Base';
import * as d3 from 'd3';
window.d3 = d3;
// const d3 = window.d3;
class PieChart extends BaseChart {
  constructor(el, options = {}) {
    super(
      el,
      {
        chart: options,
        chartType: 'PieChart'
      },
      {}
    );
  }

  getConfig() {}

  dispose() {
    this.element.innerHTML = '';
  }

  update() {
    if (!this.data) {
      return;
    }
    const data = this.data;
    var { xValue, yValue, colorSet, margin } = this.config;
    this.svg.attr('width', 'auto');
    const { width, height } = this.getWidth();
    this.svg.attr('width', width).attr('height', height);
    const pie = d3
      .pie()
      .padAngle(0.005)
      .sort(null)
      .value((d) => {
        return d[yValue];
      });
    const arcs = pie(data);
    this.totalSum = d3.sum(data, function (d) {
      return d[yValue];
    });
    const catKeys = data.map((d) => d[xValue]);
    const color2 = d3.scaleOrdinal().domain(catKeys).range(this.getColorSet(colorSet));

    this.rootGroup
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .selectAll('path')
      .data(arcs)
      .join('path')
      .attr('fill', (d) => color2(d.data[xValue]))
      .on('mouseenter', this.onMouseEnter.bind(this))
      .on('mouseleave', this.onMouseLeave.bind(this))
      // .attr('d', this.arc)
      .transition()
      .duration(500)
      .attrTween('d',  (d) => {
        var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
        return (t) => {
          d.endAngle = i(t);
          return this.arc(d);
        };
      });
  }

  draw() {
    const element = this.element;
    const d3 = this.d3;
    var { margin } = this.config;
    var { innerWidth, innerHeight } = this.getWidth();
    const radius = Math.min(innerWidth, innerHeight) / 2;
    this.arc = d3
      .arc()
      .innerRadius(radius * 0.4)
      .outerRadius(radius * 0.9);
    this.svg = d3
      .select(element)
      .append('svg')
      .attr('viewBox', [-innerWidth / 2, -innerHeight / 2, innerWidth, innerHeight]);
    this.textPie = this.svg.append('g').attr('class', 'percentage').attr('transform', `translate(${margin.left}, ${margin.top})`).append('text');
    this.textPie
      .attr('class', 'sq-chart__pie-text')
      .attr('font-family', "'Work sans', sans-serif")
      .attr('font-size', 24)
      .attr('font-weight', 900)
      .attr('text-anchor', 'middle')
      .style('opacity', '0')
      .text('0%');
    const g = this.svg.append('g');
    this.rootGroup = g;
    this.legendGroup = g
      .append('g')
      .attr('class', 'sq-chart__legend')
      .attr('transform', `translate(${innerWidth / 2 - 20}, ${50})`);
    this.tooltip = d3.create('div').attr('class', 'sq-chart-tooltip').html(`
    <div class="sq-chart-tooltip__data">
      
    </div>
  `);
    element.appendChild(this.tooltip.node());
    if (!this.data) {
      return;
    }
    this.update();
  }

  onMouseEnter(e, d) {
    const { tooltip: tooltipConfig = {}, xValue, yValue, margin } = this.config;
    const { formatter } = tooltipConfig;
    var { innerWidth, innerHeight } = this.getWidth();
    const tooltip = this.tooltip;
    const x = this.arc.centroid(d)[0] + innerWidth / 2;
    const y = this.arc.centroid(d)[1] + innerHeight / 2;
    tooltip.style('opacity', 1);
    tooltip.style('transform', `translate(calc( -50% + ${x + margin.left}px), calc(-100% + ${y + margin.top}px))`);
    const data = (formatter && formatter(e, d)) || d.data[xValue];
    tooltip.select('.sq-chart-tooltip__data').html(data);
    this.textPie.text(d3.format('.0%')(d.data[yValue] / this.totalSum)).style('opacity', 1);
  }
  onMouseLeave() {
    const tooltip = this.tooltip;
    tooltip.style('opacity', 0);
    this.textPie.style('opacity', 0);
  }
}

export default PieChart;
