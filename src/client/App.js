import React from 'react';
import { hot } from 'react-hot-loader';

import Blocks from "./components/Blocks";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      network: 'ebloc-poaasd'
    }
  }

  render() {
    return (
      <div className="container">
        <Blocks/>
      </div>
    )
  }
}

export default hot(module)(App);