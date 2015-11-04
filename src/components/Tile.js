import React from 'react';
import MineCount from 'components/MineCount';

class Tile extends React.Component {
  constructor(props) {
    super(props);
    this._handleClick = this._handleClick.bind(this);
  }

  shouldComponentUpdate(newProps, newState) {
    if (newProps.value !== this.props.value ||
      newProps.revealed !== this.props.revealed ||
      newProps.flagged !== this.props.flagged) {
      return true;
    }

    return false;
  }

  _wasMine() {
    return (this.props.value === 'X' &&
      this.props.revealed && this.props.flagged) ? 'X' : '';
  }

  render() {
    return (
      <div style={this._getBackgroundColor()}
        onClick={this._handleClick}
        onContextMenu={this.props.handleRightClick.bind(null, this.props.index)}
        className='tile'>
        <MineCount count={this.props.mineCount} />
        <p style={{color: 'white'}}>{this._wasMine()}</p>
      </div>
    );
  }

  // Wrap the passed down function. Stop execution if already revealed.
  _handleClick() {
    if (this.props.revealed || this.props.flagged) {
      return;
    }

    this.props.handleClick(this.props.index);
  }

  _getBackgroundColor() {
    let bgColor = 'gray';

    if (this.props.revealed) {
      bgColor = this.props.value === 'O' ? 'rgba(0,0,200,0.1)' : '#F00078';
    } else if (this.props.flagged) {
      bgColor = '#F0F000';
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
  revealed: false,
  flagged: false
};

Tile.propTypes = {
  handleClick: React.PropTypes.func.isRequired,
  handleRightClick: React.PropTypes.func.isRequired,
  value: React.PropTypes.string,
  revealed: React.PropTypes.bool.isRequired,
  flagged: React.PropTypes.bool.isRequired
}

export default Tile;
