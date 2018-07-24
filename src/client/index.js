/* eslint-disable max-len */
import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faAngleDoubleLeft, faChevronLeft } from '@fortawesome/free-solid-svg-icons'

import 'bootstrap';
import './index.scss';

import App from './App';

library.add(faAngleDoubleLeft, faChevronLeft);

const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

ReactDom.render(app, document.getElementById('app'));
