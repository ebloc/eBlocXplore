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

import About from 'Components/About';
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
                  <Route exact path="/">
                    <HomePage/>
                  </Route>
                  <Route exact path="/blocks/:number"
                    render={props => <BlockPage {...props}/>}
                    />
                  <Route exact path="/txs/:hash"
                    render={props => <TxPage {...props}/>}
                    />
                  <Route exact path="/accounts/:account"
                    render={props => <AccountPage {...props}/>}
                    />
                  <Route exact path="/about" component={About}/>
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
