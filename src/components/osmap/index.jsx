import {
  MapContainer,
  Marker,
  TileLayer,
} from 'react-leaflet';
import { useTemplateVal } from '@dsplay/react-template-utils';
import './style.sass';

function OSMap() {
  const latitude = useTemplateVal('latitude');
  const longitude = useTemplateVal('longitude');
  return (
    <MapContainer center={[latitude, longitude]} zoom={14} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]} />
    </MapContainer>
  );
}

export default OSMap;
