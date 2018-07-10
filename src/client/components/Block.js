import React from 'react';
import PropTypes from 'prop-types';

import utils from '../utils/index';

class Block extends React.Component {
  /**
   * @param {int} props.block
   */
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
            <a href="/@todo"><h4>{block.number}</h4></a>
          </div>
          <div><span>Miner:</span>{utils.addressLink(block.miner)}</div>
          <div><span>Time:</span>{dateString}</div>
          <div><span>Txs:</span>{block.txCount}</div>
        </div>
      </div>
    );
  }
}

Block.propTypes = {
  block: PropTypes.object.isRequired,
};

export default Block;
