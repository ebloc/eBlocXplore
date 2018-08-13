import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from 'react-redux';
import { ClipLoader } from 'react-spinners';

import utils from 'Utils';
import TxList from 'Components/TxList';
import { fetchSingleBlock } from 'Actions';

const mapStateToProps = state => ({
  block: state.blockPage.block,
  loading: state.blockPage.loading,
  error: state.blockPage.error
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: () => {
    const number = ownProps.match.params.number;
    dispatch(fetchSingleBlock(number))
  }
})

class Block extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    block: PropTypes.object,
    loading: PropTypes.bool,
    error: PropTypes.string,
    fetchData: PropTypes.func
  }

  componentDidMount() {
    this.props.fetchData();
  }

  componentDidUpdate(prevProps) {
    if(prevProps && prevProps.match.params.number != this.props.match.params.number) {
      this.props.fetchData();
    }
  }

  render() {
    const { block, loading, error } = this.props;
    if (error) {
      return (
        <div className="d-flex justify-content-center my-4">
          <h2>Block not found</h2>
        </div>
      )
    }
    if (loading || !block) {
      return (
        <div className="d-flex justify-content-center my-4">
          <ClipLoader loading={true}/>
        </div>
      )
    }
    document.title = `Blocks - ${block.number}`;
    return (
      <div id="BlockPage" className="container">
        {/* title and left-right buttons */}
        <div className="mt-3 d-flex justify-content-between align-items-center">
          <div>
            <h1 className="font-weight-normal">Block #{block.number}</h1>
            <h4 className="text-secondary font-weight-light">{block.hash}</h4>
          </div>
          <div className="d-flex">
            <Link to={`/blocks/${block.number - 1}`} className="text-tertiary">
              <FontAwesomeIcon icon="chevron-circle-left" size="3x" className="mx-1"/>
            </Link>
            <Link to={`/blocks/${block.number + 1}`} className="text-tertiary">
              <FontAwesomeIcon icon="chevron-circle-right" size="3x" className="mx-1"/>
            </Link>
          </div>
        </div>
        <hr/>
        <div className="row">
          {/* block informations */}
          <div className="col-6">
            <table className="table-responsive">
              <tbody className="text-secondary">
                <tr>
                  <td>Miner</td>
                  <td>:</td>
                  <td>
                    <Link className="text-truncate" to={`/accounts/${block.miner}`}>
                      {utils.getAccountText(block.miner)}
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
              <TxList txs={block.transactions}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Block)
