import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import utils from '../utils';

export default class Tx extends React.Component {
  static propTypes = {
    tx: PropTypes.object.isRequired,
    accountsMap: PropTypes.objectOf(PropTypes.string)
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { tx } = this.props;
    return (
      <div className="Tx card">
        <div className="card-body">
          <div className="card-title">
            <Link to={`/txs/${tx.hash}`}><h4>{tx.hash.slice(0, 20)}...</h4></Link>
          </div>
          <div><span>From:</span><Link to={`/accounts/${tx.from}`}>{utils.getAccountText(tx.from, this.props.accountsMap)}</Link></div>
          <div><span>To:</span><Link to={`/accounts/${tx.to}`}>{utils.getAccountText(tx.to, this.props.accountsMap)}</Link></div>
          <div>
            { Number(tx.value) ? <span> Value: {tx.value}</span> : <span>No value</span> }
          </div>
        </div>
      </div>
    );
  }
}
