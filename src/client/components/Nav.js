import React from 'react';
import { NavLink } from 'react-router-dom';

export default class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg">
        <span>Explorer</span>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/blocks">Blocks</NavLink>
        <NavLink to="/txs">Txs</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>
    );
  }
}
