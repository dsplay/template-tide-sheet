/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-shadow */
import { PureComponent } from 'react';
import {
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import PropTypes from 'prop-types';
import './style.sass';

const RADIAN = Math.PI / 180;
const data = [
  { name: '1', value: 1, color: '#9BFFFF' },
  { name: '2', value: 1, color: '#ADFFE9' },
  { name: '3', value: 1, color: '#D2FFC7' },
  { name: '4', value: 1, color: '#F1FFA8' },
  { name: '5', value: 1, color: '#FFE881' },
  { name: '6', value: 1, color: '#FFC25D' },
  { name: '7', value: 1, color: '#FF9832' },
  { name: '8', value: 1, color: '#FF6424' },
  { name: '9', value: 1, color: '#FE3612' },
  { name: '10', value: 1, color: '#FF0301' },
  { name: '11', value: 1, color: '#F02050' },
  { name: '12', value: 1, color: '#DF3E9C' },
  { name: '13', value: 1, color: '#CE62F6' },
  { name: '+14', value: 1, color: '#B390BA' },
];
const cx = 250 / 2;
const cy = 250 / 2;
const iR = 50;
const oR = 100;

const needle = (valueUV, data, cx, cy, iR, oR, color) => {
  let total = 0;
  data.forEach((v) => {
    total += v.value;
  });
  const ang = 180.0 * (1.02 - valueUV / total);
  const length = (iR + 2 * oR) / 3;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 8;
  const x0 = cx + 5;
  const y0 = cy + 5;
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return [
    <circle id="needle-dot" cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
    <path d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`} stroke="#none" fill={color} />,
  ];
};

class PieChartUVGauge extends PureComponent {
  render() {
    const { valueUV } = this.props;
    return (
      <PieChart width={250} height={150}>
        <Pie
          dataKey="value"
          startAngle={180}
          endAngle={0}
          data={data}
          cx={cx}
          cy={cy}
          innerRadius={iR}
          outerRadius={oR}
          fill="#8884d8"
          stroke="none"
        >
          {data.map((entry) => (
            <Cell key={`cell-${entry.name}`} fill={entry.color} />
          ))}
        </Pie>
        {needle(valueUV, data, cx, cy, iR, oR, '#000')}
      </PieChart>
    );
  }
}

PieChartUVGauge.propTypes = {
  valueUV: PropTypes.number.isRequired,
};

export default PieChartUVGauge;
