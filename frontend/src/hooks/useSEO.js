import { useEffect } from 'react';

/**
 * useSEO - A lightweight hook for setting per-page SEO tags.
 * Usage: useSEO({ title, description, canonical, schema })
 */
const useSEO = ({ title, description, canonical, schema }) => {
  useEffect(() => {
    // Title
    if (title) document.title = title;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    if (description) metaDesc.setAttribute('content', description);

    // OG Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && title) ogTitle.setAttribute('content', title);

    // OG Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && description) ogDesc.setAttribute('content', description);

    // Canonical
    let canonical_el = document.querySelector('link[rel="canonical"]');
    if (canonical_el && canonical) canonical_el.setAttribute('href', canonical);

    // JSON-LD Schema
    if (schema) {
      let existing = document.getElementById('page-schema');
      if (existing) existing.remove();
      const script = document.createElement('script');
      script.id = 'page-schema';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup page-level schema on unmount
      const s = document.getElementById('page-schema');
      if (s) s.remove();
    };
  }, [title, description, canonical, schema]);
};

export default useSEO;
