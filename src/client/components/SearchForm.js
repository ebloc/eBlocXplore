import React from 'react';

export default class SearchForm extends React.Component {
  constructor() {
    super();
    this.state = {
      contractType: null,
      query: '',
    };
    this.submit = this.submit.bind(this);
    this.setQuery = this.setQuery.bind(this);
    this.setContractType = this.setContractType.bind(this);
  }

  setQuery(e) {
    this.setState({
      query: e.target.value,
    });
  }

  setContractType(e, type) {
    this.setState({
      contractType: type,
    });
  }

  submit(e) {
    e.preventDefault();
  }

  render() {
    const { contractType } = this.state;
    return (
      <div className="text-center">
        <form onSubmit={this.submit}>
          <div className="input-group">
            <input type="text" className="form-control" onChange={this.setQuery} placeholder="Enter address, block, transaction number/hash" />
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
          </div>
        </form>
      </div>
    );
  }
}
