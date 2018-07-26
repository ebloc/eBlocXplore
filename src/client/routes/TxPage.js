import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import utils, { api } from '../utils';

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

  fetchTx = async () => {
    const tx = await api.getTx(this.props.match.params.hash);
    this.setState({
      loading: false,
      tx
    });
  }

  async componentDidUpdate(prevProps) {
    const hash = this.props.match.params.hash;
    const prevHash = prevProps && prevProps.match.params.hash;
    if (hash == prevHash) {
      return;
    }
    await this.fetchTx();
  }

  async componentDidMount() {
    await this.componentDidUpdate();
  }

  render() {
    const { tx, loading } = this.state;
    if (loading) {
      return <div className="container">Loading</div>
    }
    return (
      <div id="TxPage" className="container">
        <div className="mt-3">
          <h1 className="text-truncate">{tx.hash}</h1>
        </div>
        <div className="d-flex justify-content-center bg-light text-secondary">
          <table className="w-auto table-responsive my-3">
            <tbody>
              <tr>
                <td>From</td>
                <td>:</td>
                <td>
                  <Link className="text-truncate" to={`/accounts/${tx.from}`}>
                    {utils.getAccountText(tx.from, this.props.accountsMap)}
                  </Link>
                </td>
              </tr>
              <tr>
                <td>To</td>
                <td>:</td>
                <td>
                  <Link className="text-truncate" to={`/accounts/${tx.to}`}>
                    {utils.getAccountText(tx.to, this.props.accountsMap)}
                  </Link>
                </td>
              </tr>
              <tr>
                <td>Value</td>
                <td>:</td>
                <td>{tx.value} ETH</td>
              </tr>
              <tr>
                <td>Block</td>
                <td>:</td>
                <td><Link to={`/blocks/${tx.blockNumber}`}>{tx.blockNumber}</Link></td>
              </tr>
              <tr>
                <td>Gas</td>
                <td>:</td>
                <td>{tx.gas}</td>
              </tr>
              <tr>
                <td>Gas price</td>
                <td>:</td>
                <td>{tx.gasPrice}</td>
              </tr>
              <tr>
                <td>Nonce</td>
                <td>:</td>
                <td>{tx.nonce}</td>
              </tr>
              <tr>
                <td>Index in block</td>
                <td>:</td>
                <td>{tx.transactionIndex}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
