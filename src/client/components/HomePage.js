import React from 'react';
import PropTypes from 'prop-types';

import SearchForm from './SearchForm';
import Blocks from './Blocks';
import Txs from './Txs';

export default class HomePage extends React.Component {
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
        <div className="row text-center">
          <div className="col-10 offset-1 col-lg-6 offset-lg-3">
            <SearchForm />
          </div>
        </div>
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
