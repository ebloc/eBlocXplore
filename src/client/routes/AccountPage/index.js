import React from 'react';
import { connect } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import TxTable from 'Components/TxTable';
import AccountForm from './AccountForm';
import { fetchAccountTxs, fetchAccountBalance } from 'Actions';

const mapStateToProps = (state, ownProps) => {
  const account = ownProps.match.params.account;
  const name = state.accounts[account];
  const txData = state.accountPage.txData;
  return { ...txData, account, name };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchTxData: () => dispatch(fetchAccountTxs(ownProps.match.params.account)),
  fetchBalance: () => dispatch(fetchAccountBalance(ownProps.match.params.account))
})

class AccountPage extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    fetchTxData: PropTypes.func.isRequired,
    fetchBalance: PropTypes.func.isRequired,
    total: PropTypes.number,
    txs: PropTypes.array,
    start: PropTypes.number,
    loading: PropTypes.bool,
    error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    account: PropTypes.string,
    name: PropTypes.string,
    balance: PropTypes.number
  }

  componentDidUpdate(prevProps) {
    if(prevProps && prevProps.match.params.account != this.props.match.params.account) {
      this.props.fetchTxData();
      this.props.fetchBalance();
    }
  }

  componentDidMount() {
    this.props.fetchTxData();
    this.props.fetchBalance();
  }

  renderTxHistory = () => {
    const { total, txs, loading, account } = this.props;
    return (
      <div className="my-5">
        <h2 className="">LATEST TRANSACTIONS</h2>
        <div className="mb-4">Showing {txs.length} txs out of {total}</div>
        <TxTable currentAccount={account} txs={txs}/>
        <div>Showing {txs.length} txs out of {total}</div>
        {
          loading &&
          <div className="d-flex justify-content-center my-4">
            <ClipLoader loading={true}/>
          </div>
        }
        {
          txs.length < total && !loading &&
          <div className="d-flex justify-content-center mb-4">
            <button className="btn py-3 px-4 btn-outline-tertiary" onClick={this.props.fetchTxData}>
              SHOW MORE
            </button>
          </div>
        }
      </div>
    )
  }

  render() {
    const { account, name, balance } = this.props;
    return (
      <div id="AccountPage" className="container mt-4">
        {/* TITLE PART */}
        <div>
          { name ?
            (
              <React.Fragment>
                <h1 className="display-4">{ name }</h1>
                <h3 className="text-secondary font-weight-light">{ account }</h3>
              </React.Fragment>
            ) : (
              <h1 className="text-truncate font-weight-light">{ account }</h1>
            )
          }
        </div>
        {/* SAVE/EDIT/DELETE ACCOUNT */}
        <div className="mt-4">
          <AccountForm account={this.props.account}/>
        </div>
        {/* BALANCE */}
        <div className="mt-4 font-size-lg">
          <span className="text-secondary">Balance: </span>
          <span>{isNaN(balance) ? '...' : balance } ETH</span>
        </div>
        {this.renderTxHistory()}
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AccountPage))
