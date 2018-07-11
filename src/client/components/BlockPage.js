import React from 'react';
import PropTypes from 'prop-types';

class BlockPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { id } = this.props.match.params;
    return (
      <div>
        Single block for block#{id}
      </div>
    );
  }
}

BlockPage.propTypes = {
  match: PropTypes.object.isRequired,
};

export default BlockPage;
