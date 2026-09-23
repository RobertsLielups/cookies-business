import { useEffect, useRef } from 'react';
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '../context/LanguageContext';

const mapPadding = [32, 32];
const selectedStoreZoom = 14;

function StoreMapController({ markerRefs, selectedStoreId, stores }) {
  const map = useMap();

  useEffect(() => {
    if (stores.length === 0) return undefined;

    const storeBounds = stores.map(({ latitude, longitude }) => [latitude, longitude]);
    const selectedStore = stores.find(({ id }) => id === selectedStoreId);

    map.stop();

    if (!selectedStore) {
      map.closePopup();
      map.fitBounds(storeBounds, { padding: mapPadding });
      return undefined;
    }

    const openSelectedPopup = () => {
      markerRefs.current.get(selectedStore.id)?.openPopup();
    };

    map.once('moveend', openSelectedPopup);
    map.flyTo(
      [selectedStore.latitude, selectedStore.longitude],
      selectedStoreZoom,
      { duration: 0.75 },
    );

    return () => map.off('moveend', openSelectedPopup);
  }, [map, markerRefs, selectedStoreId, stores]);

  return null;
}

function StoreMap({ selectedStoreId, stores }) {
  const { t } = useLanguage();
  const markerRefs = useRef(new Map());
  const storeBounds = stores.map(({ latitude, longitude }) => [latitude, longitude]);

  return (
    <div className="product-where-to-buy__map" aria-label={t('whereToBuy.mapLabel')}>
      <MapContainer
        bounds={storeBounds}
        boundsOptions={{ padding: mapPadding }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <StoreMapController
          markerRefs={markerRefs}
          selectedStoreId={selectedStoreId}
          stores={stores}
        />
        {stores.map((store) => (
          <CircleMarker
            key={store.id}
            ref={(marker) => {
              if (marker) markerRefs.current.set(store.id, marker);
              else markerRefs.current.delete(store.id);
            }}
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
              {store.address}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

export default StoreMap;
