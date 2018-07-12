import React from 'react';

import SearchForm from './SearchForm';
import Blocks from './Blocks';
import Txs from './Txs';

class HomePage extends React.Component {
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
            <Blocks />
          </div>
          <div className="col">
            <Txs />
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
