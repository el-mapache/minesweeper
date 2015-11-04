import React from 'react';
import Tile from './Tile';

class Row extends React.Component {
  constructor(props) {
    super(props);
    this._onTileClick = this._onTileClick.bind(this);
  }

  _onTileClick(tileIndex) {
    this.props.onTileClick(this.props.index, tileIndex);
  }

  render() {
    let output = [];
    let index = 0;

    for (index; index < 30; index++) {
      const tileData = this.props.data[index];

      output.push(
        <Tile key={index}
          index={index}
          handleClick={this._onTileClick}
          handleRightClick={this.props.onRightClick.bind(null, this.props.index)}
          value={tileData.value}
          revealed={tileData.revealed}
          mineCount={tileData.mineCount}
          flagged={tileData.flagged} />
      );
    }

    return (
      <div className="grid-row">
        { output }
      </div>
    );
  }
}

Row.propTypes = {
  // callback function to be passed down to each tile.
  onTileClick: React.PropTypes.func.isRequired
};

export default Row;
