import {
  FitText,
} from '@dsplay/react-template-utils';
import TideChart from '../tidechart';
import OSMap from '../osmap';
import SolarData from '../solardata';
import WindData from '../winddata';
import './style.sass';

function Main() {
  return (
    <div className="main">
      <div className="flex flex-row h-full">
        <div className="h-screen w-full grid grid-cols-3 grid-rows-12 gap-4 rounded-lg">
          <div className="h-20 row-span-1 col-span-3 w-full rounded-lg bg-cyan-800">
            <h1 className="h-16 p-2 tide-title">
              <FitText>— Tábua de Marés —</FitText>
            </h1>
          </div>
          <div className="row-span-5 col-span-3 rounded-lg ds-card p-6">
            <TideChart />
          </div>
          <div className="row-span-5 rounded-lg ds-card">
            <SolarData />
          </div>
          <div className="row-span-5 rounded-lg ds-card">
            <OSMap />
          </div>
          <div className="row-span-5 rounded-lg ds-card place-content-center">
            <WindData />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
