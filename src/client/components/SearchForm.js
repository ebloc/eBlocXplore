import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { api } from '../utils';

class SearchForm extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }

  constructor() {
    super();
    this.state = {
      query: ''
    };
  }

  setQuery = (e) => {
    this.setState({
      error: false,
      query: e.target.value,
    });
  }

  search = async () => {
    try {
      const { type } = await api.search(this.state.query);
      switch (type) {
        case 'block':
          this.props.history.push(`/blocks/${this.state.query}`);
          break;
        case 'account':
          this.props.history.push(`/accounts/${this.state.query}`);
          break;
        case 'tx':
          this.props.history.push(`/txs/${this.state.query}`);
          break;
      }
      this.setState({
        error: false,
        query: ''
      });
    } catch (error) {
      this.setState({
        error: 'No result!'
      });
    }
  }

  submit = (e) => {
    e.preventDefault();
    this.search();
  }

  render() {
    return (
      <div className="SearchForm d-inline-block">
        <form onSubmit={this.submit} className="form-inline mx-auto">
          <div className="input-group">
            <input type="text" className={`px-2 ${ this.state.error ? 'is-invalid' : ''}`} value={this.state.query} onChange={this.setQuery} placeholder="Enter address, block, transaction number/hash" />
            <div className="input-group-append">
              <button className="btn d-flex align-items-center" type="submit">
                <FontAwesomeIcon icon="search" style={{fontSize:'1.25rem'}}/>
              </button>
            </div>
          </div>
          <div style={{ width: 100 }} className="ml-3 text-light d-inline-block">{ this.state.error }</div>
        </form>
      </div>
    );
  }
}

export default withRouter(SearchForm)