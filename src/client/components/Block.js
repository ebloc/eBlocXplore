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
    const dateString = (new Date(block.timestamp * 1000)).toLocaleDateString();
    return (
      <div className="Block card">
        <div className="card-body">
          <div className="card-title">
            <Link to={`/blocks/${block.number}`}>{block.number}</Link>
          </div>
          <div><span>Miner:</span><Link to={`/accounts/${block.miner}`}>{utils.getAccountText(block.miner, this.props.accountsMap)}...</Link></div>
          <div><span>Time:</span>{dateString}</div>
          <div><span>Txs:</span>{block.txCount}</div>
        </div>
      </div>
    );
  }
}
