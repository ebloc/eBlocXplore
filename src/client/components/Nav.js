import React from 'react';

export default class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg">
        <span>Explorer</span>
      </nav>
    );
  }
}
