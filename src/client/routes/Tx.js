import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import api from '../utils/apiMock';

export default class Tx extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    accountsMap: PropTypes.objectOf(PropTypes.string)
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  async componentDidMount() {
    const tx = await api.getTx(this.props.match.params.hash);
    this.setState({
      loading: false,
      tx
    });
  }

  render() {

    const { tx, loading } = this.state;
    if (loading) {
      return <div>Loading</div>
    }
    return (
      <div className="container">
        {tx.hash}
        <div><span>From:</span><Link to={`/accounts/${tx.from}`}>{tx.from.slice(0,20)}...</Link></div>
        <div><span>To:</span><Link to={`/accounts/${tx.to}`}>{tx.to.slice(0,20)}...</Link></div>
      </div>
    );
  }
}
