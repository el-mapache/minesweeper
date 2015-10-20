import React from 'react';

class MineCount extends React.Component {
  constructor(props) {
    super(props);
  }

  _getStyle() {
    if (!this.props.count) {
      return {};
    }

    return {
      color: this.props.count === 1 ? '#8EBDFF' :
             this.props.count === 2 ? '#C0D818' :
             '#F00078'
    };
  }

  render() {
    return (
      <p style={this._getStyle()}>{this.props.count}</p>
    );
  }
}

MineCount.propTypes = {
  count: React.PropTypes.number
};

export default MineCount;
