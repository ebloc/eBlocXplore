import React from 'react';
import { NavLink } from 'react-router-dom';

import SearchForm from './SearchForm';
import Logo from '../public/images/zz.png';

export default class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  toggleMyAccounts = e => {
    e.preventDefault();
    document.getElementById('MyAccounts').classList.toggle('active');
    document.getElementById('Route').classList.toggle('my-accounts-active');
  }

  render() {
    return (
      <nav className="Nav navbar navbar-expand-lg bg-tertiary fixed-top shadow d-flex">
        <NavLink to="/" className="navbar-brand text-light d-none d-lg-block">
          <img src={Logo} style={{ height: 60 }}/>
        </NavLink>
        <ul className="navbar-nav">
          <li className="nav-item mx-2">
            <NavLink to="/" className="nav-link text-light">HOME</NavLink>
          </li>
          <li className="nav-item mx-2">
            <a href="#" onClick={this.toggleMyAccounts} className="nav-link text-light">MY ACCOUNTS</a>
          </li>
          <li className="nav-item mx-2">
            <a target="_blank" rel="noreferrer noopener" href="http://ebloc.cmpe.boun.edu.tr/" className="nav-link text-light">ABOUT</a>
          </li>
        </ul>
        <div className="flex-grow-1 text-center d-none d-lg-inline-block">
          <SearchForm/>
        </div>
        <div className="d-none d-lg-block">
          <div className="dropdown">
            <button className="btn btn-outline-light dropdown-toggle" data-toggle="dropdown">eBloc-POA</button>
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
