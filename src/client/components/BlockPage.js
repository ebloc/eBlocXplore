import React from 'react';
import PropTypes from 'prop-types';

import api from '../utils/apiMock'

export default class BlockPage extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
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
    if (this.state.loading) {
      return <div className="container">Loading</div>
    }
    return (
      <div className="container">
        {this.state.block.number}
      </div>
    );
  }
}
