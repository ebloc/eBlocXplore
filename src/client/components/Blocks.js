import React from 'react';

import Block from './Block';
import api from '../utils/apiMock';

const BLOCK_CHUNK_SIZE = 10; // fetch 10 blocks per load

class Blocks extends React.Component {
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
      const blocks = await api.getBlocks(0, BLOCK_CHUNK_SIZE);
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

  getLastBlockNumber = () => this.state.blocks[this.state.blocks.length - 1]

  getNewBlocks = async () => {
    this.setState({
      loading: true,
    });
    const newBlocksStart = this.getLastBlockNumber() - BLOCK_CHUNK_SIZE;
    const newBlocks = await api.getBlocks(newBlocksStart, BLOCK_CHUNK_SIZE);
    this.setState(prevState => ({
      blocks: prevState.blocks.concat(newBlocks),
      loading: false,
    }));
  }

  // if user reached the bottom then make api call to fetch remaining blocks
  scrolled = async (e) => {
    const atBottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (atBottom && !this.state.loading) {
      this.getNewBlocks();
    }
  }

  render() {
    const { blocks, loading, error } = this.state;
    const blockNodes = blocks.map(block => <Block key={block.number} block={block} />);
    return (
      <div className="Blocks" onScroll={this.scrolled}>
        { blockNodes }
        { loading && 'loading...' }
        { error && 'error...' }
      </div>
    );
  }
}

export default Blocks;
