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
      <nav className="Nav navbar navbar-expand-lg bg-primary fixed-top shadow d-flex">
        <NavLink to="/" className="navbar-brand text-light">eBlocXplore</NavLink>
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink to="/about" className="nav-link text-light">About</NavLink>
          </li>
        </ul>
        <div className="flex-grow-1 text-center d-inline-block">
          <SearchForm/>
        </div>
        <div>
          <div className="dropdown">
            <button className="btn btn-light dropdown-toggle" data-toggle="dropdown">eBloc-POA</button>
            <div className="dropdown-menu dropdown-menu-right">
              <a href="#" className="dropdown-item active">eBloc-POA</a>
              <a className="dropdown-item disabled">Main</a>
              <a className="dropdown-item disabled">Ropsten</a>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
