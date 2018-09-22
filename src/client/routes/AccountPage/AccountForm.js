import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { addAccount, removeAccount } from 'Actions';

const mapStateToProps = (state, ownProps) => {
  const { accounts } = state
  const savedName = accounts[ownProps.account];
  return { accounts, savedName };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  save: (name) => dispatch(addAccount(ownProps.account, name)),
  remove: () => dispatch(removeAccount(ownProps.account))
})

class AccountForm extends React.Component {
  static propTypes = {
    account: PropTypes.string,
    accounts: PropTypes.object.isRequired,
    save: PropTypes.func,
    remove: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      isSaving: false
    }
  }

  accountExists = (name) => {
    for (const nextAccount in this.props.accounts) {
      const nextName = this.props.accounts[nextAccount];
      if (nextName == name && nextAccount != this.props.account) {
        return true;
      }
    }
    return false;
  }

  save = e => {
    e.preventDefault();
    const name = e.target.querySelector('input[name="account-name"]').value;
    if (!name) {
      this.setState({ error: 'Enter a name' })
    } else if (this.accountExists(name)) {
      this.setState({ error: 'Account exists' })
    } else {
      this.props.save(name);
      this.setState({ isSaving: false, error: false });
    }
  }

  addClicked = () => {
    this.setState({ isSaving: true });
  }

  renameClicked = () => {
    this.setState({ isSaving: true });
  }

  cancel = () => {
    this.setState({ isSaving: false });
  }

  remove = () => {
    this.props.remove();
    this.setState({ error: false });
  }

  render() {
    const { accounts, account } = this.props;
    const savedName = accounts[account];
    const saved = Boolean(savedName);

    if (this.state.isSaving) {
      return (
        <form onSubmit={this.save} className="form-inline d-flex">
          <div className="input-group">
            <input type="text" name="account-name" className={`form-control px-3 py-2 ${this.state.error && 'is-invalid'}`} placeholder="Enter account name" defaultValue={savedName}/>
            <div className="input-group-append">
              <button type="button" className="btn px-3 py-2 btn-danger" onClick={this.cancel}>CANCEL</button>
              <button type="submit" className="btn px-3 py-2 btn-success">SAVE</button>
            </div>
          </div>
          <div className="d-inline-block invalid-feedback">{this.state.error}</div>
        </form>
      )
    }
    if (saved) {
      return (
        <div>
          <button className="btn px-4 py-2 btn-success" onClick={this.renameClicked}>RENAME</button>
          <button className="btn px-4 py-2 btn-danger" onClick={this.remove}>REMOVE</button>
        </div>
      )
    }
    return (
      <button className="btn btn-success px-4 py-2" onClick={this.addClicked}>ADD TO MY ACCOUNTS</button>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountForm);
