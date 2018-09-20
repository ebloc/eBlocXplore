import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import utils from 'Utils';

export default class AccountPage extends React.Component {
  static propTypes = {
    txs: PropTypes.array.isRequired,
    currentAccount: PropTypes.string // used to disable link for selected account
  }

  render = () => {
    const { currentAccount, txs } = this.props;
    return (
      <table className="table">
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
                  { tx.from == currentAccount ?
                    (
                      <div className="text-secondary">{utils.getAccountText(tx.from)}</div>
                    ) : (
                      <Link to={`/accounts/${tx.from}`}>{utils.getAccountText(tx.from)}</Link>
                    )
                  }
                </td>
                <td><FontAwesomeIcon className="text-tertiary" icon="long-arrow-alt-right" size="2x"/></td>
                <td className="bold">
                  { tx.to == currentAccount ?
                    (
                      <div className="text-secondary">{utils.getAccountText(tx.to)}</div>
                    ) : (
                      <Link to={`/accounts/${tx.to}`}>{utils.getAccountText(tx.to)}</Link>
                    )
                  }
                </td>
                <td>{tx.valueInEth}</td>
                <td><Link to={`/txs/${tx.hash}`} className="text-truncate">{tx.hash}</Link></td>
                <td><Link to={`/blocks/${tx.blockNumber}`}>{tx.blockNumber}</Link></td>
                <td>{tx.gas}</td>
              </tr>
            )
          }
        </tbody>
      </table>
    )
  }
}
