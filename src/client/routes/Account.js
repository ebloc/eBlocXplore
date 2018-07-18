import React from 'react';
import PropTypes from 'prop-types';

import Tx from '../components/Tx';
import utils, { api } from '../utils';

export default class AccountPage extends React.Component {
  static propTypes = {
    accountsMap: PropTypes.objectOf(PropTypes.string),
    setAccountsMap: PropTypes.func,
    match: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  async componentDidMount() {
    this.componentDidUpdate();
  }

  // fetch data only if route has changed
  async componentDidUpdate(prevProps) {
    const prevAccount = prevProps && prevProps.match.params.account;
    const account = this.props.match.params.account;
    if (prevAccount == account) {
      return;
    }

    this.account = account;
    const { balance, txs } = await api.getAccountData(this.account);
    // if this account belongs to "My accounts"
    const saved = Boolean(this.props.accountsMap[this.account]);

    this.setState({
      loading: false,
      saving: false,
      saved,
      balance,
      txs
    });
  }

  getSavedAccountName = () => this.props.accountsMap[this.account]

  accountNameExists = name => {
    return Object.keys(this.props.accountsMap).some(nextAccount =>
      this.props.accountsMap[nextAccount] == name && this.account != nextAccount
    );
  }

  // when user saving or editing to her accounts
  startSavingAccount = () => {
    this.setState({
      saving: true,
      accountName: this.props.accountsMap[this.account]
    });
  }

  cancelSaving = () => {
    this.setState({ saving: false });
  }

  saveAccount = e => {
    e.preventDefault();
    // account name
    const value = e.target.querySelector('input[name="account-name"]').value;
    if (!value) {
      return this.setState({
        accountNameError: "Enter name"
      });
    }
    if (this.accountNameExists(value)) {
      return this.setState({
        accountNameError: "You have another account with same name"
      });
    }

    // copy accounts
    const newAccountsMap = Object.assign({}, this.props.accountsMap);
    newAccountsMap[this.account] = value;
    this.props.setAccountsMap(newAccountsMap);
    this.setState({
      saved: true,
      saving: false,
      accountNameError: undefined
    });
  }

  removeAccount = () => {
    const newAccontsMap = Object.assign({}, this.props.accountsMap);
    delete newAccontsMap[this.account];
    this.setState({ saved: false });
    this.props.setAccountsMap(newAccontsMap);
  }

  render() {
    const saveAccountForm = (
      <form onSubmit={this.saveAccount}>
        <input type="text" name="account-name" className={`form-control ${this.state.accountNameError && 'is-invalid'}`} placeholder="Enter account name" defaultValue={this.state.accountName}/>
        <div className="invalid-feedback">{this.state.accountNameError}</div>
        <button type="button" className="btn btn-danger" onClick={this.cancelSaving}>Cancel</button>
        <button type="submit" className="btn btn-default">Save</button>
      </form>
    );
    const saveAccountButton = (
      <button className="btn btn-success" onClick={this.startSavingAccount}>Add to my accounts</button>
    );
    const editAccountButtons = (
      <div>
        <button className="btn btn-success" onClick={this.startSavingAccount}>Change name</button>
        <button className="btn btn-danger" onClick={this.removeAccount}>Remove from my accounts</button>
      </div>
    );

    if (this.state.loading) {
      return <div className="container">Loading</div>
    }

    return (
      <div className="container">
        <h1>Account: {utils.getAccountText(this.account, this.props.accountsMap)}</h1>
        <div>Balance: {this.state.balance} wei</div>
        <div>
          { this.state.saving
            ? saveAccountForm
            : (this.state.saved ? editAccountButtons : saveAccountButton )
          }
        </div>
        <ul>
          { this.state.txs.map(tx => <Tx key={tx.hash} tx={tx} accountsMap={this.props.accountsMap}/>) }
        </ul>
      </div>
    );
  }
}
