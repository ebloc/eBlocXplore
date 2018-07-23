import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default class MyAccounts extends React.Component {
  static propTypes = {
    accountsMap: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const accountsMap = this.props.accountsMap;
    return (
      <div id="MyAccounts" className="active bg-light border-right">
        <ul>
          { Object.keys(accountsMap).map(account =>
            <li key={ account }>
              <Link to={`/accounts/${account}`}>
                <div>{ accountsMap[account] }</div>
                <div>{ account }</div>
              </Link>
            </li>
          )}
        </ul>
      </div>
    );
  }
}
