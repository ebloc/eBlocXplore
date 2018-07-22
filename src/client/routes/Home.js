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
          <div className="col">
            <Blocks accountsMap={this.props.accountsMap}/>
          </div>
          <div className="col">
            <Txs accountsMap={this.props.accountsMap}/>
          </div>
        </div>
      </div>
    );
  }
}
