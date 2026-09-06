// PROTOTYPE — throwaway. Floating variant switcher, hidden in production builds.
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useVariant(keys) {
  const [params, setParams] = useSearchParams();
  const current = keys.includes(params.get('variant')) ? params.get('variant') : keys[0];
  const go = (dir) => {
    const next = keys[(keys.indexOf(current) + dir + keys.length) % keys.length];
    const p = new URLSearchParams(params);
    p.set('variant', next);
    setParams(p, { replace: true });
  };
  return [current, go];
}

function PrototypeSwitcher({ keys, names, current, go }) {
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  if (import.meta.env.PROD) return null;
  return (
    <div className="proto-switcher">
      <button type="button" onClick={() => go(-1)} aria-label="Previous variant">←</button>
      <span>{current} — {names[current]}</span>
      <button type="button" onClick={() => go(1)} aria-label="Next variant">→</button>
      <em>{keys.map((k) => `?variant=${k}`).join('  ')}</em>
    </div>
  );
}

export default PrototypeSwitcher;
