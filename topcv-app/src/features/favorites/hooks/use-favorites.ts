import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'expo-router';

import { useAuth } from '@/src/lib/auth/auth-provider';
import {
  clearFavorites,
  getFavoriteState,
  replaceFavorites,
  setFavoriteLoading,
  subscribeFavorites,
  upsertFavorite,
} from '@/src/features/favorites/favorite-store';
import { getFavoriteJobs, removeFavoriteJob, saveFavoriteJob } from '@/src/features/favorites/services/favorite-api';

export function useFavorites() {
  const router = useRouter();
  const { hydrated, isAuthenticated } = useAuth();
  const favoriteState = useSyncExternalStore(subscribeFavorites, getFavoriteState, getFavoriteState);

  useEffect(() => {
    let isMounted = true;

    const loadFavorites = async () => {
      if (!hydrated) {
        return;
      }

      if (!isAuthenticated) {
        clearFavorites();
        return;
      }

      try {
        setFavoriteLoading(true);
        const response = await getFavoriteJobs(100);

        if (!isMounted) {
          return;
        }

        replaceFavorites(response.data.jobs.map((item) => item.job_id));
      } catch {
        if (isMounted) {
          clearFavorites();
        }
      }
    };

    void loadFavorites();

    return () => {
      isMounted = false;
    };
  }, [hydrated, isAuthenticated]);

  const requireAuth = () => {
    if (isAuthenticated) {
      return true;
    }

    router.push('/(auth)/login');
    return false;
  };

  const toggleFavorite = async (jobId: string) => {
    if (!requireAuth()) {
      return;
    }

    const isFavorited = favoriteState.ids.has(jobId);
    upsertFavorite(jobId, !isFavorited);

    try {
      if (isFavorited) {
        await removeFavoriteJob(jobId);
      } else {
        await saveFavoriteJob(jobId);
      }
    } catch {
      upsertFavorite(jobId, isFavorited);
    }
  };

  return {
    favoriteIds: favoriteState.ids,
    favoritesLoading: favoriteState.loading,
    isFavorited: (jobId: string) => favoriteState.ids.has(jobId),
    toggleFavorite,
  };
}
