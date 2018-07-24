import React from 'react';
import PropTypes from 'prop-types';

import Blocks from '../components/Blocks';
import Txs from '../components/Txs';

export default class Home extends React.Component {
  static propTypes = {
    accountsMap: PropTypes.objectOf(PropTypes.string)
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="HomePage container">
        <div className="row">
          <div className="col-6">
            <h4 className="p-3 m-0">LAST BLOCKS</h4>
            <Blocks accountsMap={this.props.accountsMap}/>
          </div>
          <div className="col-6">
            <h4 className="p-3 m-0">LAST TRANSACTIONS</h4>
            <Txs accountsMap={this.props.accountsMap}/>
          </div>
        </div>
      </div>
    );
  }
}
