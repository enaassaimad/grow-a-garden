import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './hooks/useTheme';
import { LocalizationProvider } from './hooks/useLocalization';
import { AdMobProvider } from './hooks/useAdMob';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <LocalizationProvider>
        <AdMobProvider>
          <App />
        </AdMobProvider>
      </LocalizationProvider>
    </ThemeProvider>
  </React.StrictMode>
);