/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  useTemplateVal,
  FitText,
} from '@dsplay/react-template-utils';
import PieChartUVGauge from '../piechartuvgauge';

const SolarData = () => {
  const [solarData, setSolarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const stormGlassAPIKey = useTemplateVal('storm_glass_api_key');
  const latitude = useTemplateVal('latitude');
  const longitude = useTemplateVal('longitude');

  useEffect(() => {
    const fetchSolarData = async () => {
      const lat = latitude;
      const lng = longitude;
      const apiKey = stormGlassAPIKey;
      const solarStorageKey = 'solarData';
      const storageTimestampKey = 'solarDataTimestamp';

      const storedSolarData = localStorage.getItem(solarStorageKey);
      const storedTimestamp = localStorage.getItem(storageTimestampKey);
      const currentTime = new Date().getTime();
      const params = 'uvIndex';

      if (storedSolarData && storedTimestamp) {
        const lastUpdateTime = new Date(parseInt(storedTimestamp, 10)).getTime();

        // Check if the stored data is less than 24 hours old
        if (currentTime - lastUpdateTime < 2 * 60 * 60 * 1000) {
          const solarData = JSON.parse(storedSolarData);
          setSolarData(solarData);
          setLoading(false);
          console.log('Solar Data fetched from storage:', JSON.parse(storedSolarData));
          return;
        }
      }

      try {
        const solarEndpoint = `https://api.stormglass.io/v2/solar/point?lat=${lat}&lng=${lng}&params=${params}&start=${currentTime}&end=${currentTime}&source=noaa`;

        const response = await axios.get(solarEndpoint, {
          headers: {
            Authorization: apiKey,
          },
        });

        const { data: solarData } = response;

        localStorage.setItem(solarStorageKey, JSON.stringify(solarData));
        localStorage.setItem(storageTimestampKey, new Date().getTime().toString());

        setSolarData(solarData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchSolarData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data </div>;

  return (
    <div className="flex flex-col items-center">
      {solarData && (
        <div>
          <div className="w-full h-56">
            {solarData.hours.map((hourData) => (
              <div key={hourData.time} className="w-full h-12">
                <div className="w-full h-36 self-center">
                  <PieChartUVGauge
                    valueUV={hourData.uvIndex ? hourData.uvIndex.noaa * 100 : 0}
                  />
                </div>
                <div className="grid grid-flow-row auto-rows-max">
                  <div className="h-16 w-full">
                    <FitText>
                      {hourData.uvIndex ? (hourData.uvIndex.noaa * 100).toFixed(0) : 0}
                    </FitText>
                  </div>
                  <div className="h-8 w-full">
                    <FitText>
                      UV Index now
                    </FitText>
                  </div>
                  <div className="h-6 w-full">
                    <FitText>
                      {new Date(hourData.time).toLocaleString()}
                    </FitText>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SolarData;
