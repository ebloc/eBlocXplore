import { connect } from 'react-redux';

import TxList from 'Components/TxList';
import { fetchHomeTxs } from 'Actions';

const mapStateToProps = (state) => {
  const { txs, loading } =  state.home.txData;
  return { txs, loading };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onScrollEnd: () => dispatch(fetchHomeTxs())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TxList);
