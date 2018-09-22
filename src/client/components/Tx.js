import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import utils from 'Utils';

export default class Tx extends React.Component {
  static propTypes = {
    tx: PropTypes.object.isRequired,
    accountsMap: PropTypes.objectOf(PropTypes.string)
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { tx } = this.props;
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
                    <Link to={`/accounts/${tx.from}`}>{utils.getAccountText(tx.from, this.props.accountsMap)}</Link>
                  </td>
                </tr>
                <tr>
                  <td>To</td>
                  <td>:</td>
                  <td><Link to={`/accounts/${tx.to}`}>{utils.getAccountText(tx.to, this.props.accountsMap)}</Link></td>
                </tr>
                <tr>
                  <td>Value</td>
                  <td>:</td>
                  <td>{tx.valueInEth}</td>
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
}
