type FavoriteState = {
  ids: Set<string>;
  loading: boolean;
};

type Listener = () => void;

let state: FavoriteState = {
  ids: new Set<string>(),
  loading: false,
};

const listeners = new Set<Listener>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function subscribeFavorites(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getFavoriteState() {
  return state;
}

export function replaceFavorites(ids: string[]) {
  state = {
    ...state,
    ids: new Set(ids),
    loading: false,
  };
  emitChange();
}

export function setFavoriteLoading(loading: boolean) {
  state = {
    ...state,
    loading,
  };
  emitChange();
}

export function upsertFavorite(jobId: string, favorited: boolean) {
  const nextIds = new Set(state.ids);

  if (favorited) {
    nextIds.add(jobId);
  } else {
    nextIds.delete(jobId);
  }

  state = {
    ...state,
    ids: nextIds,
  };
  emitChange();
}

export function clearFavorites() {
  state = {
    ids: new Set<string>(),
    loading: false,
  };
  emitChange();
}
