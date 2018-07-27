import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import debug from 'debug';

import HomePage from './routes/HomePage';
import BlockPage from './routes/BlockPage';
import TxPage from './routes/TxPage';
import NotFoundPage from './routes/NotFoundPage';
import AccountPage from './routes/AccountPage';
import About from './components/About';
import Nav from './components/Nav';
import MyAccounts from './components/MyAccounts';

debug.log = console.log.bind(console); // eslint-disable-line no-console

const getInitialAccountsMap = () => {
  let accountsMap = localStorage.getItem('accountsMap');

  if (accountsMap) {
    return JSON.parse(accountsMap);
  } else {
    // test accounts
    accountsMap = {
      '0x42B085Db58Fd54176CFE935dc52e782A8B36DA05': 'Test 1',
      '0x3B027ff2D229dD1C7918910dEe32048F5F65b70d': 'Test 2',
      '0x128c9F368F12C24Cc2a4f88dCDCf3daA13C9667e': 'Test 3'
    };
    localStorage.setItem('accountsMap', JSON.stringify(accountsMap));
    return accountsMap;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      network: 'ebloc-poa',
      accountsMap: getInitialAccountsMap()
    };
  }

  setAccountsMap = (accountsMap) => {
    localStorage.setItem('accountsMap', JSON.stringify(accountsMap));
    this.setState({
      accountsMap
    });
  }

  render() {
    return (
      <React.Fragment>
        <Nav/>
        <MyAccounts accountsMap={this.state.accountsMap}/>
        <div id="Route" className="my-accounts-active">
          <Switch>
            <Route exact path="/">
              <HomePage accountsMap={this.state.accountsMap}/>
            </Route>
            <Route exact path="/blocks/:number"
              render={props => <BlockPage {...props} accountsMap={this.state.accountsMap}/>}
              />
            <Route exact path="/txs/:hash"
              render={props => <TxPage {...props} accountsMap={this.state.accountsMap}/>}
              />
            <Route exact path="/accounts/:account"
              render={props => <AccountPage {...props} accountsMap={this.state.accountsMap} setAccountsMap={this.setAccountsMap} getAccountName={this.getAccountName}/>}
              />
            <Route exact path="/about" component={About}/>
            <Route component={NotFoundPage}/>
          </Switch>
        </div>
      </React.Fragment>
    );
  }
}

export default hot(module)(App);
