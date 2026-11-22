import ColumnChart from './d3/ColumnChart';
import PieChart from './d3/PieChart';
import LineChart from './d3/LineChart';
import AreaChart from './d3/AreaChart';

const _chartMap = {
  d3: { Column: ColumnChart, Pie: PieChart, Line: LineChart, Area: AreaChart }
};

class ChartFactory {
  provider: string;
  constructor({ provider = 'd3' } = {}) {
    this.provider = provider;
  }

  get() {
    return _chartMap[this.provider];
  }
}

export default ChartFactory;
