import React from 'react';
import PropTypes from 'prop-types';

import Tx from './Tx';
import { api } from '../utils';

export default class Txs extends React.Component {
  static propTypes = {
    accountsMap: PropTypes.objectOf(PropTypes.string)
  }

  constructor(props) {
    super(props);
    this.state = {
      txs: [],
    };
  }

  async componentDidMount() {
    this.setState({ loading: true });
    try {
      const txs = await api.getTxs();
      this.setState({
        txs,
        loading: false,
      });
    } catch (error) {
      this.setState({
        error,
        loading: false,
      });
    }
  }

  render() {
    const { txs, loading, error } = this.state;
    return (
      <div className="Txs">
        { loading && 'loading...' }
        { error && 'error...' }
        { txs.map(tx => <Tx key={tx.hash} tx={tx} accountsMap={this.props.accountsMap}/>) }
      </div>
    );
  }
}
