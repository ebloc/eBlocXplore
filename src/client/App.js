import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import PropTypes from 'prop-types';
import debug from 'debug';

import HomePage from './routes/HomePage';
import BlockPage from './routes/BlockPage';
import TxPage from './routes/TxPage';
import NotFoundPage from './routes/NotFoundPage';
import AccountPage from './routes/AccountPage';

import Nav from 'Components/Nav';
import MyAccounts from 'Components/MyAccounts';

debug.log = console.log.bind(console); // eslint-disable-line no-console

class App extends React.Component {
  static propTypes = {
    store: PropTypes.object,
    history: PropTypes.object
  }
  render() {
    return (
      <Provider store={this.props.store}>
        <ConnectedRouter history={this.props.history}>
          <BrowserRouter>
            <React.Fragment>
              <Nav/>
              <MyAccounts/>
              <div id="Route" className="my-accounts-active">
                <Switch>
                  <Route exact path="/"><HomePage/></Route>
                  <Route exact path="/blocks/:number"><BlockPage/></Route>
                  <Route exact path="/txs/:hash"><TxPage/></Route>
                  <Route exact path="/accounts/:account"><AccountPage/></Route>
                  <Route component={NotFoundPage}/>
                </Switch>
              </div>
            </React.Fragment>
          </BrowserRouter>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default hot(module)(App);
