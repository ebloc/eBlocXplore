import React from 'react';
import { NavLink } from 'react-router-dom';

import SearchForm from './SearchForm';

export default class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <nav className="Nav navbar navbar-expand-lg">
        <span>Explorer</span>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <SearchForm />
      </nav>
    );
  }
}
