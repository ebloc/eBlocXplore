import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { hot } from 'react-hot-loader';

import HomePage from './components/HomePage';
import BlockPage from './components/BlockPage';
import TxPage from './components/TxPage';
import About from './components/About';
import Nav from './components/Nav';
import NotFoundPage from './components/NotFoundPage';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // network: 'ebloc',
    };
  }

  render() {
    return (
      <React.Fragment>
        <Nav />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/blocks" component={BlockPage} />
          <Route exact path="/blocks/:id" component={BlockPage} />
          <Route exact path="/tx/:hash" component={TxPage} />
          <Route exact path="/about" component={About} />
          <Route component={NotFoundPage} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default hot(module)(App);
