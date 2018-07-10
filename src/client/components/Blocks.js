import React from 'react';
import PropTypes from 'prop-types';

import Block from './Block';

class Blocks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blocks: props.blocks,
      lastChecked: new Date(),
    };
  }

  componentDidMount() {
    this.newBlocksTimer = setInterval(() => {
      this.checkNewBlocks();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.newBlocksTimer);
  }

  checkNewBlocks() {
    this.setState({
      lastChecked: new Date(),
    });
  }

  render() {
    const { blocks, lastChecked } = this.state;
    const blockNodes = blocks.map(block => <Block key={block.number} block={block} />);
    return (
      <div>
        <div>Last checked: {lastChecked.toString()}</div>
        { blockNodes }
      </div>
    );
  }
}

Blocks.propTypes = {
  blocks: PropTypes.array,
};

Blocks.defaultProps = {
  blocks: [],
};

export default Blocks;
