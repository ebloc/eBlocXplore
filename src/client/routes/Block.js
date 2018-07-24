import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import utils, { api } from '../utils';
import Tx from '../components/Tx';

export default class Block extends React.Component {
  static propTypes = {
    accountsMap: PropTypes.objectOf(PropTypes.string),
    match: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  async componentDidMount() {
    const block = await api.getBlock(this.props.match.params.number);
    this.setState({
      loading: false,
      block
    });
  }

  render() {
    const { block } = this.state;
    if (this.state.loading) {
      return <div className="container">Loading</div>
    }
    return (
      <div id="BlockPage" className="container">
        <div className="mt-3 d-flex justify-content-between align-items-center">
          <div>
            <h1 className="font-weight-normal">Block #{block.number}</h1>
            <h4 className="text-secondary font-weight-light">{block.hash}</h4>
          </div>
          <div>
            <Link to={`/blocks/${block.number - 1}`}><FontAwesomeIcon icon="chevron-circle-left" size="3x" className="mx-1"/></Link>
            <Link to={`/blocks/${block.number + 1}`}><FontAwesomeIcon icon="chevron-circle-right" size="3x" className="mx-1"/></Link>
          </div>
        </div>
        <hr/>
        {/* block informations */}
        <div className="row">
          <div className="col-6">
            <table className="table-responsive">
              <tbody className="text-secondary">
                <tr>
                  <td>Miner</td>
                  <td>:</td>
                  <td>
                    <Link className="text-truncate" to={`/accounts/${block.miner}`}>
                      {utils.getAccountText(block.miner, this.props.accountsMap)}
                    </Link>
                  </td>
                </tr>
                <tr><td>Gas limit</td><td>:</td><td>{block.gasLimit}</td></tr>
                <tr><td>Gas used</td><td>:</td><td>{block.gasUsed}</td></tr>
                <tr><td>Nonce</td><td>:</td><td>{block.nonce}</td></tr>
                <tr><td>Time</td><td>:</td><td>{utils.formatDate(new Date(block.timestamp * 1000))}</td></tr>
                <tr><td>Difficulty</td><td>:</td><td>{block.difficulty}</td></tr>
                <tr><td>Total difficulty</td><td>:</td><td>{block.totalDifficulty}</td></tr>
                <tr><td>Transaction count</td><td>:</td><td>{block.transactions.length}</td></tr>
              </tbody>
            </table>
          </div>
          {/* txs */}
          <div className="col-6">
            <div className="border-top border-bottom" style={{ maxHeight: '75vh', overflowY: 'scroll' }}>
              {
                block.transactions.map(tx =>
                  <div key="tx.hash" className="mb-3">
                    <Tx tx={tx} accountsMap={this.props.accountsMap}/>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
