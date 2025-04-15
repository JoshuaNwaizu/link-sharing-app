import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './utils/dataSlice';
import linkReducer from './utils/linkSlice';
// import ProfileReducer from './utils/profileSlice';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('linkState');
    if (serializedState === null) return undefined;
    const parsed = JSON.parse(serializedState);
    return {
      link: parsed.link,
    };
  } catch (err) {
    return undefined;
  }
};
const persistedState = loadState();

export const store = configureStore({
  reducer: {
    data: dataReducer,
    link: linkReducer,
    // profile: ProfileReducer,
  },
  preloadedState: persistedState,
});

store.subscribe(() => {
  const state = store.getState();
  const toPersist = {
    link: state.link,
    // profile: state.profile, // Persist profile data too
  };
  localStorage.setItem('reduxState', JSON.stringify(toPersist));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
