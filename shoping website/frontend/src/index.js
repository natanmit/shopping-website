import { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
// ** Redux Imports
import { store } from './redux/store';
import { Provider } from 'react-redux';

import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './assets/css/app-loader.scss';
import FullScreenLoader from './components/FullScreenLoader';

// ** Lazy load app
const LazyApp = lazy(() => import('./App'));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <CookiesProvider>
        <Suspense fallback={<FullScreenLoader />}>
          <LazyApp />
        </Suspense>
      </CookiesProvider>
    </Provider>
  </BrowserRouter>
);

reportWebVitals();
