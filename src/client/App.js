import React from 'react';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      network: 'ebloc-poa'
    }
  }

  render() {
    return (
      <div style={{background: 'yellow'}}>
        <h2>Deneme1</h2>
        <p>Network name: {this.state.network}</p>
      </div>
    )
  }
}