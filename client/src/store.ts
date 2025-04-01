import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './utils/dataSlice';
import linkReducer from './utils/linkSlice';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('linkState');
    if (serializedState === null) return undefined;
    return { link: JSON.parse(serializedState) };
  } catch (err) {
    return undefined;
  }
};
const persistedState = loadState();

export const store = configureStore({
  reducer: {
    data: dataReducer,
    link: linkReducer,
  },
  preloadedState: persistedState,
});

store.subscribe(() => {
  const linkState = store.getState().link;
  localStorage.setItem('linkState', JSON.stringify(linkState));
});

//   reducers: {

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
