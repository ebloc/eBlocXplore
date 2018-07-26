import React from 'react';
import PropTypes from 'prop-types';
import { ClipLoader } from 'react-spinners';
import debug from 'debug';

import Block from './Block';
import { api } from '../utils';

const log = debug('log:block');
const BLOCK_CHUNK_SIZE = 10; // fetch 10 blocks per load

class Blocks extends React.Component {
  static propTypes = {
    accountsMap: PropTypes.objectOf(PropTypes.string)
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: true, // whether component is waiting for api call
      blocks: [],
    };
  }

  async componentDidMount() {
    this.setState({ loading: true });
    try {
      log('Fetching last blocks');
      const blocks = (await api.getBlocks(0, BLOCK_CHUNK_SIZE)).reverse();
      this.setState({
        blocks,
        loading: false,
      });
    } catch (error) {
      this.setState({
        error,
        loading: false,
      });
    }
  }

  getNewStartingBlockNum = () => this.state.blocks[this.state.blocks.length - 1].number - BLOCK_CHUNK_SIZE

  getNewBlocks = async () => {
    this.setState({
      loading: true,
    });
    const newBlocksStart = this.getNewStartingBlockNum();
    log(`Fetching new ${BLOCK_CHUNK_SIZE} blocks from ${newBlocksStart}`)
    const newBlocks = (await api.getBlocks(newBlocksStart, BLOCK_CHUNK_SIZE)).reverse();
    this.setState(prevState => ({
      blocks: prevState.blocks.concat(newBlocks),
      loading: false,
    }));
  }

  // if user reached the bottom then make api call to fetch remaining blocks
  scrolled = (e) => {
    const atBottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <= 1;
    if (atBottom && !this.state.loading) {
      this.getNewBlocks();
    }
  }

  render() {
    const { blocks, loading, error } = this.state;
    const blockNodes = blocks.map(block =>
      <div key={block.number} className="mb-3">
        <Block accountsMap={this.props.accountsMap} block={block}/>
      </div>
    );
    return (
      <div className="Blocks border-top border-bottom" onScroll={this.scrolled}>
        { blockNodes }
        { loading &&
          <div className="d-flex justify-content-center py-5">
            <ClipLoader loading={this.state.loading}/>
          </div>
        }
        { error && 'error...' }
      </div>
    );
  }
}

export default Blocks;
