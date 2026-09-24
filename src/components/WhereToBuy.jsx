import { Suspense, lazy, useRef, useState } from 'react';
import StorePicker from './StorePicker';
import { stores } from '../data/stores';
import { useLanguage } from '../context/LanguageContext';
import '../styles/where-to-buy.css';

// Leaflet reads window on import. Only load it after the user opens the section.
const StoreMap = lazy(() => import('./StoreMap'));
const mappableStores = stores.filter(
  ({ latitude, longitude }) => Number.isFinite(latitude) && Number.isFinite(longitude),
);

function WhereToBuy() {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const controlsRef = useRef(null);
  const cityStores = stores.filter((store) => store.city === selectedCity);
  const selectedStore = cityStores.find((store) => store.id === selectedStoreId);

  function selectCity(city) {
    setSelectedCity(city);
    setSelectedStoreId('');
  }

  return (
    <section id="where-to-buy" className="section where-to-buy" aria-labelledby="where-to-buy-title">
      <div className="container">
        <div className="where-to-buy__header">
          <div>
            <h2 id="where-to-buy-title" className="where-to-buy__title">{t('whereToBuy.title')}</h2>
            <p className="where-to-buy__intro">{t('whereToBuy.intro')}</p>
            <p className="where-to-buy__disclaimer">{t('whereToBuy.disclaimer')}</p>
          </div>
          <button
            type="button"
            className="where-to-buy__toggle"
            aria-label={t('whereToBuy.findStore')}
            aria-expanded={expanded}
            aria-controls="where-to-buy-content"
            onClick={() => {
              setHasOpened(true);
              setExpanded(!expanded);
            }}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 7.5 5 5 5-5" /></svg>
          </button>
        </div>
        <div
          id="where-to-buy-content"
          className={`where-to-buy__reveal${expanded ? ' where-to-buy__reveal--open' : ''}`}
          aria-hidden={!expanded}
          inert={!expanded}
        >
          <div className="where-to-buy__reveal-inner">
            {hasOpened && (
              <div className="where-to-buy__content">
                <div ref={controlsRef} className="where-to-buy__controls">
                  <StorePicker stores={stores} value={selectedCity} onSelect={selectCity} />
                  {selectedCity && (
                    <div className="where-to-buy__stores">
                      <h3 id="where-to-buy-city" className="where-to-buy__city">{selectedCity}</h3>
                      <ul className="where-to-buy__store-list" aria-labelledby="where-to-buy-city">
                        {cityStores.map((store) => (
                          <li key={store.id}>
                            <button
                              type="button"
                              className="where-to-buy__store"
                              aria-pressed={selectedStoreId === store.id}
                              onClick={() => setSelectedStoreId(store.id)}
                            >
                              <span className="where-to-buy__store-name">{store.name}</span>
                              <span className="where-to-buy__store-address">{store.address}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <Suspense fallback={<div className="where-to-buy__map" aria-busy="true" aria-label={t('whereToBuy.mapLabel')} />}>
                  <StoreMap
                    stores={mappableStores}
                    selectedCity={selectedCity}
                    selectedStoreId={selectedStoreId}
                    visible={expanded}
                  />
                </Suspense>
                <div className="where-to-buy__actions">
                  {selectedCity && (
                    <button type="button" onClick={() => {
                      selectCity('');
                      controlsRef.current?.querySelector('button')?.focus({ preventScroll: true });
                    }}>{t('whereToBuy.allLocations')}</button>
                  )}
                  {selectedStore && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedStore.latitude},${selectedStore.longitude}`)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t('whereToBuy.openInMaps')}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhereToBuy;
