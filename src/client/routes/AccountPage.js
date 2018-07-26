import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import utils, { api } from '../utils';

const TX_CHUNK_SIZE = 100;

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

  fetchData = async () => {
    this.account = this.props.match.params.account;
    const balance = await api.getAccountBalance(this.account);
    const { total, start, txs } = await api.getTxsByAccount(this.account, 'last', TX_CHUNK_SIZE);

    // if this account belongs to "My accounts"
    const saved = Boolean(this.props.accountsMap[this.account]);

    this.setState({
      loading: false,
      saving: false,
      saved,
      balance,
      txHistory: {
        total,
        start,
        txs: txs.reverse()
      }
    });
  }

  async componentDidMount() {
    await this.componentDidUpdate();
  }

  // fetch data only if route has changed
  async componentDidUpdate(prevProps) {
    const prevAccount = prevProps && prevProps.match.params.account;
    const account = this.props.match.params.account;
    if (prevAccount == account) {
      return;
    }
    await this.fetchData();
  }

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

  loadMoreTxs = async () => {
    const { txHistory } =  this.state;
    let newStart = txHistory.start - txHistory.txs.length;
    let newChunkSize = TX_CHUNK_SIZE;
    if (newStart < 0) {
      newChunkSize += newStart;
      newStart = 0;
    }

    const { total, txs } = await api.getTxsByAccount(this.account, newStart, newChunkSize);
    this.setState(prevState => ({
      txHistory: {
        total: total,
        start: newStart,
        txs: prevState.txHistory.txs.concat(txs.reverse())
      }
    }));
  }

  renderTxHistory = () => {
    if (this.state.loading) return <div>loading tx history</div>

    const { total, txs } = this.state.txHistory;
    return (
      <div className="my-5">
        <h2 className="">Last Transactions</h2>
        <div>Showing {txs.length} txs out of {total}</div>
        <table className="table mt-4">
          <thead>
            <tr>
              <th>From</th>
              <th></th>
              <th>To</th>
              <th>Value (ETH)</th>
              <th>Hash</th>
              <th>Block</th>
              <th>Gas</th>
            </tr>
          </thead>
          <tbody>
            {
              txs.map(tx =>
                <tr key={tx.hash}>
                  <td className="bold">
                    { tx.from == this.account ?
                      (
                        <div className="text-secondary">{utils.getAccountText(tx.from, this.props.accountsMap)}</div>
                      ) : (
                        <Link to={`/accounts/${tx.from}`}>{utils.getAccountText(tx.from, this.props.accountsMap)}</Link>
                      )
                    }
                  </td>
                  <td><FontAwesomeIcon className="text-tertiary" icon="long-arrow-alt-right" size="2x"/></td>
                  <td className="bold">
                    { tx.to == this.account ?
                      (
                        <div className="text-secondary">{utils.getAccountText(tx.to, this.props.accountsMap)}</div>
                      ) : (
                        <Link to={`/accounts/${tx.to}`}>{utils.getAccountText(tx.to, this.props.accountsMap)}</Link>
                      )
                    }
                  </td>
                  <td>{tx.value}</td>
                  <td><Link to={`/txs/${tx.hash}`} className="text-truncate">{tx.hash}</Link></td>
                  <td><Link to={`/blocks/${tx.blockNumber}`}>{tx.blockNumber}</Link></td>
                  <td>{tx.gas}</td>
                </tr>
              )
            }
          </tbody>
          {/* { txs.map(tx => <Tx key={tx.hash} tx={tx} accountsMap={this.props.accountsMap}/>) } */}
        </table>
        <div>Showing {txs.length} txs out of {total}</div>
        { txs.length < total &&
          <div className="d-flex justify-content-center mb-4">
            <button className="btn py-3 px-4 btn-outline-tertiary" onClick={() => this.loadMoreTxs()}>
              SHOW MORE
            </button>
          </div>
        }
      </div>
    )
  }

  render() {
    if (this.state.loading) {
      return <div className="container">Loading</div>
    }

    return (
      <div id="AccountPage" className="container mt-4">
        {/* TITLE PART */}
        <div>
          { this.state.saved ?
            (
              <React.Fragment>
                <h1 className="display-4">{ this.props.accountsMap[this.account] }</h1>
                <h3 className="text-secondary font-weight-light">{ this.account }</h3>
              </React.Fragment>
            ) : (
              <h1 className="text-truncate font-weight-light">{ this.account }</h1>
            )
          }
        </div>
        {/* SAVE/EDIT/DELETE ACCOUNT */}
        <div className="mt-4">
          { this.state.saving ?
            (
              <form onSubmit={this.saveAccount} className="form-inline d-flex">
                <div className="input-group">
                  <input type="text" name="account-name" className={`form-control px-3 py-2 ${this.state.accountNameError && 'is-invalid'}`} placeholder="Enter account name" defaultValue={this.state.accountName}/>
                  <div className="input-group-append">
                    <button type="button" className="btn px-3 py-2 btn-danger" onClick={this.cancelSaving}>CANCEL</button>
                    <button type="submit" className="btn px-3 py-2 btn-success">SAVE</button>
                  </div>
                </div>
                <div className="d-inline-block invalid-feedback">{this.state.accountNameError}</div>
              </form>
            ) : (
              this.state.saved ? (
                <div>
                  <button className="btn px-4 py-2 btn-success" onClick={this.startSavingAccount}>RENAME</button>
                  <button className="btn px-4 py-2 btn-danger" onClick={this.removeAccount}>REMOVE</button>
                </div>
              ) : (
                <button className="btn btn-success px-4 py-2" onClick={this.startSavingAccount}>ADD TO MY ACCOUNTS</button>
              )
            )
          }
        </div>
        {/* BALANCE */}
        <div className="mt-4 font-size-lg">
          <span className="text-secondary">Balance: </span>
          <span>{this.state.balance} ETH</span>
        </div>
        {this.renderTxHistory()}
      </div>
    );
  }
}
