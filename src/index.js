import { createRoot } from 'react-dom/client';

import App from './App';

const startApp = () => {
  createRoot(
    document.getElementById('root')
  ).render(
    <App />
  );
}
if(window.cordova) {
  document.addEventListener('deviceready', startApp, false);
} else {
  startApp()
}
