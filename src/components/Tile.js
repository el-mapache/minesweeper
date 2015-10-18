import React from 'react';
import MineCount from 'components/MineCount';

class Tile extends React.Component {
  constructor(props) {
    super(props);
    this._handleClick = this._handleClick.bind(this);
  }

  shouldComponentUpdate(newProps, newState) {
    if (newProps.value !== this.props.value ||
      newProps.revealed !== this.props.revealed) {
      return true;
    }

    return false;
  }

  render() {
    return (
      <div style={this._getBackgroundColor()}
        onClick={this._handleClick}
        className='tile'>
        <MineCount count={this.props.mineCount} />
      </div>
    );
  }

  _handleClick() {
    if (this.props.revealed) {
      return;
    }

    this.props.handleClick(this.props.index);
  }

  _getBackgroundColor() {
    const value = this.props.value;
    const revealed = this.props.revealed;

    let bgColor = 'gray';

    if (revealed) {
      bgColor = value === 'O' ? 'rgba(0,0,200,0.1)' : 'red';
    }

    return {
      'backgroundColor': bgColor
    };
  }
}

Tile.defaultProps = {
  // `value` represents whether or not a mine has been revealed. Used to
  // determine the color of the tile.
  value: null,
  revealed: false
};

Tile.propTypes = {
  handleClick: React.PropTypes.func.isRequired,
  value: React.PropTypes.string,
  revealed: React.PropTypes.bool
}

export default Tile;
