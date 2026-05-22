'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const FAVORITES_KEY = 'tinyops_favorites';
const RECENTLY_VIEWED_KEY = 'tinyops_recently_viewed';

// ── Recently Viewed ──

export function useRecentlyViewed() {
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setRecentSlugs(parsed);
      }
    } catch {
      // ignore
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentSlugs));
    }
  }, [recentSlugs, isLoaded]);

  const trackView = useCallback((slug: string) => {
    setRecentSlugs((prev) => {
      const filtered = prev.filter((s) => s !== slug);
      return [slug, ...filtered].slice(0, 10);
    });
  }, []);

  return { recentSlugs, isLoaded, trackView };
}

export function getRecentlyViewed(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

// ── Favorites ──

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setFavorites(parsed);
      }
    } catch {
      setError('Failed to load favorites');
      setFavorites([]);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded && isMounted.current) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === FAVORITES_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setFavorites(parsed);
        } catch { /* ignore */ }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  const addFavorite = useCallback((slug: string) => {
    setFavorites((prev) => prev.includes(slug) ? prev : [...prev, slug]);
  }, []);

  const removeFavorite = useCallback((slug: string) => {
    setFavorites((prev) => prev.filter((s) => s !== slug));
  }, []);

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(slug);
      return isFav ? prev.filter((s) => s !== slug) : [...prev, slug];
    });
  }, []);

  const prevFavoritesRef = useRef(favorites);
  useEffect(() => {
    if (prevFavoritesRef.current !== favorites) {
      prevFavoritesRef.current = favorites;
      window.dispatchEvent(new CustomEvent('favorites-changed', {
        detail: { favorites }
      }));
    }
  }, [favorites]);

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      setFavorites(e.detail.favorites);
    };
    window.addEventListener('favorites-changed', handler as EventListener);
    return () => window.removeEventListener('favorites-changed', handler as EventListener);
  }, []);

  const isFavorite = useCallback((slug: string) => favorites.includes(slug), [favorites]);

  return { favorites, isLoaded, error, addFavorite, removeFavorite, toggleFavorite, isFavorite };
}

export function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

export function checkIsFavorite(slug: string): boolean {
  if (typeof window === 'undefined') return false;
  return getFavorites().includes(slug);
}
