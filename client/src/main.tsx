import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import App from './App.tsx';
import { store } from './store.ts';
import { LoginModalProvider } from './pages/contexts/LoginModalContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <LoginModalProvider>
        <App />
      </LoginModalProvider>
    </Provider>
  </StrictMode>,
);
