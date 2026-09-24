import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/store-picker.css';

function normalizeSearch(value) {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();
}

function filterOptions(options, query) {
  const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);
  return options.filter((option) => {
    const text = normalizeSearch(option.name);
    return terms.every((term) => text.includes(term));
  });
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function StorePicker({ stores, value, onSelect }) {
  const { t } = useLanguage();
  const id = useId();
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const searchRef = useRef(null);
  const listRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState('');
  const [panelLayout, setPanelLayout] = useState({ above: false, height: 400 });
  const options = [...new Set(stores.map((store) => store.city))]
    .sort((a, b) => a.localeCompare(b, 'lv'))
    .map((city) => ({ id: city, name: city }));
  const selectedCity = options.find((option) => option.id === value);
  const matchingCities = filterOptions(options, query);
  const label = t('whereToBuy.cityLabel');
  const placeholder = t('whereToBuy.selectCity');
  const searchLabel = t('whereToBuy.searchCities');
  const optionIds = ['', ...matchingCities.map((store) => store.id)];
  const currentActiveId = optionIds.includes(activeId) ? activeId : '';
  const optionId = (storeId) => `${id}-option-${storeId || 'all'}`;

  function closePicker(restoreFocus = false) {
    setIsOpen(false);
    if (restoreFocus) triggerRef.current?.focus({ preventScroll: true });
  }

  function chooseCity(storeId) {
    onSelect(storeId);
    closePicker(true);
  }

  function openPicker() {
    setQuery('');
    setActiveId(value);
    setIsOpen(true);
  }

  useLayoutEffect(() => {
    if (!isOpen) return undefined;

    const mobile = window.matchMedia('(max-width: 900px)').matches;
    const inline = Boolean(rootRef.current.closest('.where-to-buy'));
    if (mobile || inline) rootRef.current.scrollIntoView({ block: 'start', behavior: 'instant' });

    function positionPanel() {
      const viewport = window.visualViewport;
      const viewportHeight = viewport?.height ?? window.innerHeight;
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportTop = viewport?.offsetTop ?? 0;
      const below = viewportTop + viewportHeight - rect.bottom - 16;
      const headerHeight = parseFloat(getComputedStyle(rootRef.current).scrollMarginTop);
      const above = rect.top - viewportTop - headerHeight - 16;
      const isMobile = window.matchMedia('(max-width: 900px)').matches;
      const openAbove = !isMobile && !inline && below < 280 && above > below;
      setPanelLayout({
        above: openAbove,
        height: isMobile
          ? Math.min(400, Math.max(140, Math.min(viewportHeight * 0.5, below)))
          : Math.min(400, Math.max(160, openAbove ? above : below)),
      });
    }

    positionPanel();
    (mobile ? listRef : searchRef).current?.focus({ preventScroll: true });
    window.addEventListener('resize', positionPanel);
    window.visualViewport?.addEventListener('resize', positionPanel);
    window.visualViewport?.addEventListener('scroll', positionPanel);
    return () => {
      window.removeEventListener('resize', positionPanel);
      window.visualViewport?.removeEventListener('resize', positionPanel);
      window.visualViewport?.removeEventListener('scroll', positionPanel);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const option = document.getElementById(optionId(currentActiveId));
    const list = listRef.current;
    if (option && list) {
      const row = option.getBoundingClientRect();
      const bounds = list.getBoundingClientRect();
      if (row.top < bounds.top) list.scrollTop -= bounds.top - row.top;
      if (row.bottom > bounds.bottom) list.scrollTop += row.bottom - bounds.bottom;
    }
  }, [isOpen, currentActiveId, query, panelLayout.height]);

  function onOptionKeyDown(event) {
    if (event.nativeEvent.isComposing) return;
    const index = optionIds.indexOf(currentActiveId);
    const searching = event.target === searchRef.current;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      setActiveId(optionIds[(index + direction + optionIds.length) % optionIds.length]);
    } else if (!searching && (event.key === 'Home' || event.key === 'End')) {
      event.preventDefault();
      setActiveId(event.key === 'Home' ? optionIds[0] : optionIds.at(-1));
    } else if (event.key === 'Enter' || (!searching && event.key === ' ')) {
      event.preventDefault();
      chooseCity(currentActiveId);
    }
  }

  function renderOption(store) {
    const storeId = store?.id ?? '';
    return (
      <div
        key={storeId}
        id={optionId(storeId)}
        role="option"
        aria-selected={value === storeId}
        className={`store-picker__option${currentActiveId === storeId ? ' store-picker__option--active' : ''}`}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => chooseCity(storeId)}
      >
        <span className="store-picker__option-copy">
          <span className="store-picker__option-name">{store?.name ?? t('whereToBuy.allLocations')}</span>
        </span>
        {value === storeId && <span className="store-picker__check" aria-hidden="true">✓</span>}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={`store-picker store-picker--city${isOpen ? ' store-picker--open' : ''}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) closePicker();
      }}
      onKeyDown={(event) => {
        if (isOpen && event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          closePicker(true);
        }
      }}
    >
      <div className="store-picker__anchor">
        <button
          ref={triggerRef}
          type="button"
          className="store-picker__trigger"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={isOpen ? `${id}-panel` : undefined}
          aria-labelledby={`${id}-label ${id}-value`}
          onClick={() => isOpen ? closePicker() : openPicker()}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              openPicker();
            }
          }}
        >
          <span className="store-picker__pin"><LocationIcon /></span>
          <span className="store-picker__trigger-copy">
            <span id={`${id}-label`} className="store-picker__eyebrow">{label}</span>
            <span id={`${id}-value`} className="store-picker__value">
              <span>{selectedCity?.name ?? placeholder}</span>
            </span>
          </span>
          <svg className="store-picker__chevron" viewBox="0 0 20 20" aria-hidden="true"><path d="m5 7.5 5 5 5-5" /></svg>
        </button>

        {isOpen && (
          <div
            id={`${id}-panel`}
            role="dialog"
            aria-labelledby={`${id}-label`}
            className={`store-picker__panel${panelLayout.above ? ' store-picker__panel--above' : ''}`}
            style={{ '--picker-panel-height': `${panelLayout.height}px` }}
          >
            <div className="store-picker__search-wrap">
              <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" /><path d="m13 13 4 4" /></svg>
              <input
                ref={searchRef}
                type="text"
                role="combobox"
                aria-label={searchLabel}
                aria-autocomplete="list"
                aria-expanded="true"
                aria-controls={`${id}-list`}
                aria-activedescendant={optionId(currentActiveId)}
                placeholder={searchLabel}
                value={query}
                autoComplete="off"
                spellCheck="false"
                onChange={(event) => {
                  const nextQuery = event.target.value;
                  setQuery(nextQuery);
                  setActiveId(filterOptions(options, nextQuery)[0]?.id ?? '');
                }}
                onKeyDown={onOptionKeyDown}
              />
            </div>
            <div
              ref={listRef}
              id={`${id}-list`}
              role="listbox"
              aria-label={label}
              aria-activedescendant={optionId(currentActiveId)}
              tabIndex={0}
              className="store-picker__list"
              onKeyDown={onOptionKeyDown}
            >
              {renderOption(null)}
              {matchingCities.map(renderOption)}
            </div>
            <p className="store-picker__results" role="status">
              {matchingCities.length ? t('whereToBuy.cityResults', { count: matchingCities.length }) : t('whereToBuy.noCities')}
            </p>
          </div>
        )}
      </div>


    </div>
  );
}

export default StorePicker;
