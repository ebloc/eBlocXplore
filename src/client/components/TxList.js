import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import utils from 'Utils';

export default class TxList extends React.Component {
  static propTypes = {
    txs: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string,
    onScrollEnd: PropTypes.func
  }

  scrolled = e => {
    if (!this.props.onScrollEnd) return;
    const atBottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <= 1;
    if (atBottom) {
      this.props.onScrollEnd();
    }
  }

  renderTx = tx => {
    return (
      <div className="Tx card border-0">
        <div className="card-body text-secondary">
          <div className="card-title">
            <Link to={`/txs/${tx.hash}`}><h5 className="text-truncate">{tx.hash}</h5></Link>
          </div>
          <div className="d-flex">
            <table className="mr-5 table-responsive">
              <tbody>
                <tr>
                  <td>From</td>
                  <td>:</td>
                  <td className="text-truncate">
                    <Link to={`/accounts/${tx.from}`}>{utils.getAccountText(tx.from)}</Link>
                  </td>
                </tr>
                <tr>
                  <td>To</td>
                  <td>:</td>
                  <td><Link to={`/accounts/${tx.to}`}>{utils.getAccountText(tx.to)}</Link></td>
                </tr>
                <tr>
                  <td>Value</td>
                  <td>:</td>
                  <td>{tx.valueInEth} ETH</td>
                </tr>
              </tbody>
            </table>
            <table className="table-responsive">
              <tbody>
                <tr>
                  <td>Block</td>
                  <td>:</td>
                  <td>
                    <Link to={`/blocks/${tx.blockNumber}`}>{tx.blockNumber}</Link>
                  </td>
                </tr>
                <tr>
                  <td>Gas</td>
                  <td>:</td>
                  <td>{tx.gas}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { txs, loading, error } = this.props;
    return (
      <div className="Txs border-top border-bottom" onScroll={this.scrolled}>
        { error && 'error...' }
        {
          txs.map(tx =>
            <div key={tx.hash} className="mb-3">
              { this.renderTx(tx) }
            </div>
          )
        }
        {
          loading &&
          <div className="d-flex justify-content-center py-5">
            <ClipLoader loading={loading}/>
          </div>
        }
      </div>
    );
  }
}
