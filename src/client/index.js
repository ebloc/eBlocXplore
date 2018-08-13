/* eslint-disable max-len */
import React from 'react';
import ReactDom from 'react-dom';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons/faChevronCircleLeft';
import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons/faChevronCircleRight';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons/faLongArrowAltRight';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
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

library.add(faChevronCircleLeft, faChevronCircleRight, faChevronLeft, faLongArrowAltRight, faSearch, faGithub);

const appContainer = document.createElement('div');
document.body.appendChild(appContainer);

ReactDom.render(<App store={store} history={history}/>, appContainer);
