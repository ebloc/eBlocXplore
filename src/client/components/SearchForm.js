import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";

import { api } from '../utils';

class SearchForm extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }

  constructor() {
    super();
    this.state = {
      contractType: null,
      query: '',
    };
  }

  setQuery = (e) => {
    this.setState({
      query: e.target.value,
    });
  }

  setContractType = (e, type) => {
    this.setState({
      contractType: type,
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
        error: false
      })
    } catch (error) {
      this.setState({
        error: 'Not found'
      });
    }
  }

  submit = (e) => {
    e.preventDefault();
    this.search();
  }

  render() {
    const { contractType } = this.state;
    return (
      <div className="text-center">
        <form onSubmit={this.submit}>
          <div className="input-group">
            <input type="text" className={`form-control ${ this.state.error && 'is-invalid'}`} onChange={this.setQuery} placeholder="Enter address, block, transaction number/hash" />
            <div className="input-group-append">
              <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {contractType || 'None'}
              </button>
              <div className="dropdown-menu">
                <button type="button" className="dropdown-item" onClick={e => this.setContractType(e, null)}>None</button>
                <button type="button" className="dropdown-item" onClick={e => this.setContractType(e, 'ERC-20')}>ERC-20</button>
                <button type="button" className="dropdown-item" onClick={e => this.setContractType(e, 'ERC-771')}>ERC-771</button>
              </div>
            </div>
            <div className="invalid-feedback">{this.state.error}</div>
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(SearchForm)