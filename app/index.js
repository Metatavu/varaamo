import 'location-origin';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-intl-redux';
import { browserHistory, Router } from 'react-router';
import { createStore } from 'redux';
import Immutable from 'seamless-immutable';
import ReactGA from 'react-ga';

import 'assets/styles/app.less';
import 'assets/styles/customization/espoo/customization.less';
import { initI18n } from 'i18n';
import configureStore from 'store/configureStore';
import rootReducer from 'state/rootReducer';
import getRoutes from './routes';

const initialStoreState = createStore(rootReducer, {}).getState();
const initialServerState = window.INITIAL_STATE;
const initialIntlState = initI18n();
const finalState = Immutable(initialStoreState).merge(
  [initialServerState, initialIntlState], { deep: true }
);
const store = configureStore(finalState);
const initializeGoogleAnalytics = () => {
  const gaTrackingCodeElement = document.getElementById('ga-tracking-code');
  const gaTrackingCode = gaTrackingCodeElement ? gaTrackingCodeElement.getAttribute('value') : null;
  if (gaTrackingCode) {
    ReactGA.initialize(gaTrackingCode);
    browserHistory.listen((location) => {
      ReactGA.pageview(`${location.pathname}${location.search}`);
    });
  }
};

initializeGoogleAnalytics();
render(
  <Provider store={store}>
    <Router history={browserHistory}>
      {getRoutes(store)}
    </Router>
  </Provider>,
  document.getElementById('root')
);
