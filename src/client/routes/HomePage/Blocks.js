import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ClipLoader } from 'react-spinners';

import Block from 'Components/Block';
import { fetchBlocks } from 'Actions';

const mapStateToProps = (state) => {
  const { blocks, loading } =  state.home.blockData;
  return { blocks, loading };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onScrollEnd: () => dispatch(fetchBlocks())
  }
}

function Blocks({ blocks, loading, error, onScrollEnd }) {
  // if user reached the bottom then make api call to fetch remaining blocks
  const scrolled = e => {
    const atBottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <= 1;
    if (atBottom) {
      onScrollEnd();
    }
  };

  return (
    <div className="Blocks border-top border-bottom" onScroll={scrolled}>
      {
        blocks.map(block =>
          <div key={block.number} className="mb-3">
            <Block block={block}/>
          </div>
        )
      }
      {
        loading &&
        <div className="d-flex justify-content-center py-5">
          <ClipLoader loading={loading}/>
        </div>
      }
      { error && 'error...' }
    </div>
  )
}

Blocks.propTypes = {
  blocks: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onScrollEnd: PropTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(Blocks);
