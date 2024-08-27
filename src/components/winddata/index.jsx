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
import PieChartRoseCompass from '../piechartrosecompass';

const WindData = () => {
  const [windData, setWindData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const stormGlassAPIKey = useTemplateVal('storm_glass_api_key');
  const latitude = useTemplateVal('latitude');
  const longitude = useTemplateVal('longitude');

  useEffect(() => {
    const fetchWindData = async () => {
      const lat = latitude;
      const lng = longitude;
      const apiKey = stormGlassAPIKey;
      const windStorageKey = 'windData';
      const storageTimestampKey = 'windDataTimestamp';

      const storedWindData = localStorage.getItem(windStorageKey);
      const storedTimestamp = localStorage.getItem(storageTimestampKey);
      const currentTime = new Date().getTime();
      const params = ['windSpeed', 'windDirection'];

      if (storedWindData && storedTimestamp) {
        const lastUpdateTime = new Date(parseInt(storedTimestamp, 10)).getTime();

        // Check if the stored data is less than 24 hours old
        if (currentTime - lastUpdateTime < 2 * 60 * 60 * 1000) {
          const windData = JSON.parse(storedWindData);
          setWindData(windData);
          setLoading(false);
          console.log('Wind Data fetched from storage >>>', JSON.parse(storedWindData));
          return;
        }
      }

      try {
        const windEndpoint = `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}&start=${currentTime}&end=${currentTime}`;

        const response = await axios.get(windEndpoint, {
          headers: {
            Authorization: apiKey,
          },
        });

        const { data: windData } = response;

        localStorage.setItem(windStorageKey, JSON.stringify(windData));
        localStorage.setItem(storageTimestampKey, new Date().getTime().toString());

        setWindData(windData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchWindData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) {
    return (
      <div>
        Error fetching data -
        {error.toString()}
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center">
      {windData && (
        <div>
          <div className="w-full pt-3">
            {windData.hours.map((hourData) => (
              <div key={hourData.time} className="w-full">
                <div className="w-full self-center">
                  <PieChartRoseCompass
                    windDirection={hourData.windDirection.noaa}
                  />
                </div>
                <div className="flex flex-wrap -mt-2">
                  <div className="h-10 w-1/2 p-2 items-center">
                    <FitText>
                      Wind velocity
                    </FitText>
                  </div>
                  <div className="h-10 w-1/2 p-2 items-center">
                    <FitText>
                      Wind direction
                    </FitText>
                  </div>
                  <div className="h-10 w-1/2 p-1 items-center -mt-2">
                    <FitText>
                      {hourData.windSpeed ? `${Math.round((hourData.windSpeed.noaa) * 3.6)} km/h ` : 0}

                    </FitText>
                  </div>
                  <div className="h-10 w-1/2 p-1 items-center -mt-2">
                    <FitText>
                      {
                      hourData.windDirection
                        ? `${Math.round((hourData.windDirection.noaa))} °` : 0
                      }
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

export default WindData;
