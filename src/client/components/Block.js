import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import utils from '../utils';

export default class Block extends React.Component {
  static propTypes = {
    block: PropTypes.object.isRequired,
    accountsMap: PropTypes.objectOf(PropTypes.string)
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { block } = this.props;
    const dateString = utils.formatDate(new Date(block.timestamp * 1000));
    return (
      <div className="Block card border-0">
        <div className="card-body text-secondary">
          <div className="card-title">
            <Link to={`/blocks/${block.number}`}>
              <h5>{block.number}</h5>
              <div className="text-secondary font-weight-light text-truncate">{block.hash}</div>
            </Link>
          </div>
          <table>
            <tr>
              <td>Miner</td>
              <td>:</td>
              <td>
                <Link className="text-truncate" to={`/accounts/${block.miner}`}>
                  {utils.getAccountText(block.miner, this.props.accountsMap)}
                </Link>
              </td>
            </tr>
            <tr>
              <td>Time</td>
              <td>:</td>
              <td>{dateString}</td>
            </tr>
            <tr>
              <td>Transactions</td>
              <td>:</td>
              <td>{block.transactions.length}</td>
            </tr>
          </table>
        </div>
      </div>
    );
  }
}
