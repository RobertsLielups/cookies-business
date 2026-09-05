import { useEffect } from 'react';
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '../context/LanguageContext';

function FitMapToStores({ stores }) {
  const map = useMap();

  useEffect(() => {
    if (stores.length === 1) {
      map.setView([stores[0].latitude, stores[0].longitude], 14);
      return;
    }

    map.fitBounds(stores.map(({ latitude, longitude }) => [latitude, longitude]), {
      padding: [32, 32],
    });
  }, [map, stores]);

  return null;
}

function StoreAvailabilityMap({ stores }) {
  const { t } = useLanguage();
  const firstStore = stores[0];

  return (
    <div className="product-availability__map" aria-label={t('availability.mapLabel')}>
      <MapContainer
        center={[firstStore.latitude, firstStore.longitude]}
        zoom={14}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitMapToStores stores={stores} />
        {stores.map((store) => (
          <CircleMarker
            key={store.id}
            center={[store.latitude, store.longitude]}
            pathOptions={{
              color: '#987b3d',
              fillColor: '#c7a968',
              fillOpacity: 0.9,
              weight: 2,
            }}
            radius={9}
          >
            <Popup>
              <strong>{store.name}</strong>
              <br />
              {store.address}, {store.city}
              <br />
              {store.status === 'available'
                ? t('availability.available')
                : t('availability.lowStock')}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

export default StoreAvailabilityMap;
