/* eslint-disable max-len */
import React from 'react';
import ReactDom from 'react-dom';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronCircleLeft, faChevronCircleRight, faChevronLeft, faLongArrowAltRight, faSearch } from '@fortawesome/free-solid-svg-icons'
import { connectRouter } from 'connected-react-router';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { createBrowserHistory } from 'history';

import 'bootstrap';
import './index.scss';
import reducers from './state/reducers';

import App from './App';

const history = createBrowserHistory();
const store = createStore(
  connectRouter(history)(reducers),
  applyMiddleware(thunkMiddleware)
);
window.store = store;

library.add(faChevronCircleLeft, faChevronCircleRight, faChevronLeft, faLongArrowAltRight, faSearch);

ReactDom.render(<App store={store} history={history}/>, document.getElementById('app'));
