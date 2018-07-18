import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { hot } from 'react-hot-loader';

import HomePage from './components/HomePage';
import BlockPage from './components/BlockPage';
import TxPage from './components/TxPage';
import About from './components/About';
import Nav from './components/Nav';
import MyAccounts from './components/MyAccounts';
import NotFoundPage from './components/NotFoundPage';
import AccountPage from './components/AccountPage';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      network: 'ebloc-poa',
      accountsMap: {
        '0x42B085Db58Fd54176CFE935dc52e782A8B36DA05': 'Deneme'
      }
    };
  }

  setAccountsMap = (accountsMap) => {
    this.setState({
      accountsMap
    });
  }

  render() {
    return (
      <React.Fragment>
        <Nav/>
        <MyAccounts accountsMap={this.state.accountsMap}/>
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
      </React.Fragment>
    );
  }
}

export default hot(module)(App);
