import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import utils from 'Utils';
import { fetchSingleTx } from 'Actions';

const mapStateToProps = state => ({
  tx: state.txPage.tx,
  loading: state.txPage.loading,
  error: state.txPage.error
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: () => {
    const hash = ownProps.match.params.hash;
    dispatch(fetchSingleTx(hash));
  }
})

class Tx extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    tx: PropTypes.object,
    loading: PropTypes.bool,
    error: PropTypes.string,
    fetchData: PropTypes.func
  }

  componentDidMount() {
    this.props.fetchData();
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { tx, loading, error } = this.props;
    if (error) {
      return (
        <div className="d-flex justify-content-center my-4">
          <h2>Transaction not found</h2>
        </div>
      )
    }
    if (loading || !tx) {
      return (
        <div className="d-flex justify-content-center my-4">
          <ClipLoader loading={true}/>
        </div>
      )
    }

    // const { tx } = this.state;
    // if (!tx) return <div></div>;
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
                    {utils.getAccountText(tx.from)}
                  </Link>
                </td>
              </tr>
              <tr>
                <td>To</td>
                <td>:</td>
                <td>
                  <Link className="text-truncate" to={`/accounts/${tx.to}`}>
                    {utils.getAccountText(tx.to)}
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

export default connect(mapStateToProps, mapDispatchToProps)(Tx)
