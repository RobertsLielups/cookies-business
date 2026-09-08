import { useEffect } from 'react';

/** Keeps the document title and description in sync after client-side navigation. Prerender sets the initial ones. */
export function usePageMeta({ title, description }) {
  useEffect(() => {
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }, [title, description]);
}
