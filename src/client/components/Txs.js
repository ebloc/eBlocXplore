import React from 'react';
import PropTypes from 'prop-types';
import debug from 'debug';

import Tx from './Tx';
import { api } from '../utils';

const log = debug('log:tx');
const TX_CHUNK_SIZE = 10; // fetch 10 blocks per load

export default class Txs extends React.Component {
  static propTypes = {
    accountsMap: PropTypes.objectOf(PropTypes.string)
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      txs: [],
    };
  }

  async componentDidMount() {
    log('Fetching last txs');
    this.setState({
      loading: true
    });
    try {
      const { txs, start } = await api.getLastTxs(TX_CHUNK_SIZE);
      this.nextTxStart = start - TX_CHUNK_SIZE; // start to fetch from here
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

  // if user reached the bottom then make api call to fetch remaining blocks
  scrolled = (e) => {
    const atBottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (atBottom && !this.state.loading) {
      this.loading = true;
      this.getNewTxs();
    }
  }

  getNewTxs = async () => {
    this.setState({
      loading: true,
    });
    log(`Fetching new ${TX_CHUNK_SIZE} txs from ${this.nextTxStart}`)
    const { txs } = (await api.getTxs(this.nextTxStart, TX_CHUNK_SIZE));
    this.nextTxStart -= TX_CHUNK_SIZE;
    this.setState(prevState => ({
      txs: prevState.txs.concat(txs),
      loading: false,
    }));
    this.loading = false;
  }

  render() {
    const { txs, loading, error } = this.state;
    return (
      <div className="Txs border-top border-bottom" onScroll={this.scrolled}>
        { error && 'error...' }
        { txs.map(tx =>
          <div key="tx.hash" className="mb-3">
            <Tx tx={tx} accountsMap={this.props.accountsMap}/>
          </div>
        )}
        { loading && 'loading...' }
      </div>
    );
  }
}
