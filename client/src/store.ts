import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import dataReducer from './utils/dataSlice';
import linkReducer from './utils/linkSlice';
import ProfileReducer from './utils/profileSlice';
import { useDispatch } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('linkState');
    if (serializedState === null) return undefined;
    const parsed = JSON.parse(serializedState);
    return {
      link: parsed.link,
      profile: parsed.profile,
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
    profile: ProfileReducer,
  },
  preloadedState: persistedState,
});

store.subscribe(() => {
  const state = store.getState();
  const toPersist = {
    link: state.link,
    profile: {
      firstName: state.profile.firstName,
      lastName: state.profile.lastName,
      email: state.profile.email,
      imageUrl: state.profile.imageUrl,
    },
  };
  localStorage.setItem('reduxState', JSON.stringify(toPersist));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
