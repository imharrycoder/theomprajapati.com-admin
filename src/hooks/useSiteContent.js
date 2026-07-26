import { useEffect, useState, useCallback } from 'react';
import { apiFetch } from '../utils/api';
import { defaultSiteContent } from '../data/siteContent.js';
import { mergeSiteContent } from '../utils/mergeSiteContent.js';

/**
 * Custom hook for loading, updating, and saving site content.
 * Extracts all data-management logic from ManageContent.jsx.
 */
export function useSiteContent() {
  const [content, setContent] = useState(defaultSiteContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiFetch('/site-content', { suppressToast: true })
      .then((data) => setContent(mergeSiteContent(defaultSiteContent, data)))
      .catch(() => setContent(defaultSiteContent))
      .finally(() => setLoading(false));
  }, []);

  const updateSection = useCallback((section, updates) => {
    setContent((current) => ({
      ...current,
      [section]: { ...current[section], ...updates },
    }));
  }, []);

  const updateArrayItem = useCallback((section, key, index, updates) => {
    setContent((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: current[section][key].map((item, itemIndex) =>
          itemIndex === index ? { ...item, ...updates } : item,
        ),
      },
    }));
  }, []);

  const addArrayItem = useCallback((section, key, item) => {
    setContent((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: [...(current[section][key] || []), item],
      },
    }));
  }, []);

  const removeArrayItem = useCallback((section, key, index) => {
    setContent((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: current[section][key].filter((_, itemIndex) => itemIndex !== index),
      },
    }));
  }, []);

  const save = useCallback(async (event) => {
    if (event?.preventDefault) event.preventDefault();
    setSaving(true);

    try {
      const data = await apiFetch('/site-content', {
        method: 'PUT',
        body: JSON.stringify(content),
      });
      setContent(mergeSiteContent(defaultSiteContent, data));
    } catch {
      // apiFetch displays the error toast
    } finally {
      setSaving(false);
    }
  }, [content]);

  return { content, loading, saving, updateSection, updateArrayItem, addArrayItem, removeArrayItem, save };
}
