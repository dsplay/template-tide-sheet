/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, LabelList, Tooltip, ReferenceArea,
} from 'recharts';
import { useTemplateVal } from '@dsplay/react-template-utils';

const TideChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const stormGlassAPIKey = useTemplateVal('storm_glass_api_key');
  const latitude = useTemplateVal('latitude');
  const longitude = useTemplateVal('longitude');

  useEffect(() => {
    const fetchData = async () => {
      const lat = latitude;
      const lng = longitude;
      const apiKey = stormGlassAPIKey;
      const extremesStorageKey = 'tideExtremesData';
      const storageTimestampKey = 'tideDataTimestamp';

      const storedExtremesData = localStorage.getItem(extremesStorageKey);
      const storedTimestamp = localStorage.getItem(storageTimestampKey);
      const currentTime = new Date().toISOString();
      const endDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

      if (storedExtremesData && storedTimestamp) {
        const lastUpdateTime = new Date(parseInt(storedTimestamp, 10)).getTime();

        // Check if the stored data is less than 24 hours old
        if (Date.now() - lastUpdateTime < 24 * 60 * 60 * 1000) {
          const extremesData = JSON.parse(storedExtremesData);
          processChartData(extremesData);
          setLoading(false);
          console.log('Tide data fetched from storage >>>', JSON.parse(storedExtremesData));
          return;
        }
      }

      try {
        const extremesEndpoint = `https://api.stormglass.io/v2/tide/extremes/point?datum=MLLW&lat=${lat}&lng=${lng}&start=${currentTime}&end=${endDate}`;

        const response = await axios.get(extremesEndpoint, { headers: { Authorization: apiKey } });
        const { data: extremesData } = response;

        localStorage.setItem(extremesStorageKey, JSON.stringify(extremesData));
        localStorage.setItem(storageTimestampKey, new Date().getTime().toString());

        processChartData(extremesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err);
        setLoading(false);
      }
    };

    const processChartData = (extremesData) => {
      // Process and aggregate data
      const data = extremesData.data.map((item) => ({
        time: new Date(item.time).toLocaleString(),
        height: parseFloat(item.height),
        type: item.type,
      }));

      setChartData(data);
    };

    fetchData();
  }, [latitude, longitude, stormGlassAPIKey]);

  if (loading) return <div>Loading...</div>;
  if (error) {
    return (
      <div>
        Error fetching data -
        {error.toString()}
      </div>
    );
  }

  const formatTime = (time) => {
    const date = moment(time);
    if (!date.isValid()) {
      console.error('Invalid time format:', time);
      const fallbackDate = moment();
      return fallbackDate.format('HH:mm');
    }
    return date.format('HH:mm');
  };

  const formatDate = (time) => {
    const date = moment(time);
    if (!date.isValid()) {
      console.error('Invalid date format:', time);
      const fallbackDate = moment();
      return fallbackDate.format('DD/YYYY');
    }
    return date.format('DD/MM');
  };

  const renderCustomLabel = ({
    x, y, value, index,
  }) => {
    const fillColor = chartData[index].type === 'low' ? 'red' : '#2D879A';
    const { time } = chartData[index];
    return (
      <g transform={`translate(${x},${y - 35})`}>
        <path
          d="M0,-31.25 C10.3125,-31.25 20.625,-21.875 20.625,-9.375 C20.625,3.125 0,21.875 0,21.875 C0,21.875 -20.625,3.125 -20.625,-9.375 C-20.625,-21.875 -10.3125,-31.25 0,-31.25 Z"
          fill={fillColor}
        />
        <circle cx="0" cy="-10" r="16" fill="white" />
        <text x="0" y="-6" textAnchor="middle" fill={fillColor} fontSize="12px" fontWeight="bold">
          {value.toFixed(2)}
        </text>
        <rect x="-20" y="46" width="40" height="20" fill="white" rx={8} />
        <text x="0" y="60" textAnchor="middle" fill={fillColor} fontSize="12px" fontWeight="bold">
          {formatTime(time)}
        </text>
      </g>
    );
  };

  const renderCustomDot = ({
    cx, cy, index,
  }) => {
    const fillColor = chartData[index].type === 'low' ? 'red' : '#2D879A';
    console.log(chartData[index]);

    return (
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill={fillColor}
      />
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={500}
        height={500}
        data={chartData}
        margin={{
          top: 65,
          right: 30,
          left: 0,
          bottom: 30,
        }}
      >
        <defs>
          <linearGradient id="colorHeight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#315bdb" stopOpacity={1} />
            <stop offset="95%" stopColor="#92eeff" stopOpacity={1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          tickFormatter={formatDate}
          axisLine={false}
          tickLine={false}
          tick={{ transform: 'translate(0, 10)', fill: 'white' }}
          height={20}
          orientation="bottom"
        />
        <YAxis
          dataKey="height"
          domain={[-1, 3]}
          type="number"
          allowDataOverflow={true}
          tick={{ transform: 'translate(-20, 0)', fill: 'white' }}
          label={{
            value: 'Metros',
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle', fill: 'white' },
          }}
        />
        <ReferenceArea y1={-1} y2={0} fill="red" fillOpacity={0.3} />
        <Area
          type="monotone"
          dataKey="height"
          stroke="#8884d8"
          fill="url(#colorHeight)"
          dot={renderCustomDot}
        >
          <Tooltip />
          <LabelList
            dataKey="height"
            position="top"
            content={renderCustomLabel}
            style={{ fill: 'cyan', fontSize: 20 }}
          />
        </Area>
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TideChart;
