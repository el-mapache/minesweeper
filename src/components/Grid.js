import React from 'react';
import Row from 'components/Row';
import FloodFill from 'utils/FloodFill';

let _points = [];

class Grid extends React.Component {
  constructor(props) {
    super(props);

    this._checkNeighbors = this._checkNeighbors.bind(this);
    this._placeMarker = this._placeMarker.bind(this);
  }

  _getRowsFrom(board) {
    const _this = this;
    const rows = board.rows;

    return board.board.map(function each(row, index) {
      const ref = 'Row' + index;

      return (
        <Row key={index}
          data={row}
          ref={ref}
          index={index}
          onTileClick={_this._checkNeighbors}
          onRightClick={_this._placeMarker} />
      );
    });
  }

  _getContainerStyle() {
    return {
      'height': `${this.props.width}px`,
      'width': `${this.props.width}px`
    };
  }

  _checkNeighbors(row, column) {
    if (!this.props.playing) {
      return;
    }

    this.props.onTileClick();

    if (this.state.board[row][column].value === 'X') {
      let newBoard = this.state.board.slice();

      // User has clicked on a mine, reveal it and end the game.
      newBoard.forEach(function(row) {
        row.forEach((tile) => {
          if (tile.value === 'X') {
            tile.revealed = true;
          }
        });
      });

      const newState = {board: newBoard};
      return this.setState(newState, function() {
        this.props.onLose();
      });
    }

    // create a copy of the board so we can mutate it freely
    let newBoard = this.state.board.slice();

    // call the flood fill algorithm
    FloodFill(newBoard, row, column);

    this.setState({
      board: newBoard
    }, function() {
      // check if the player has won
      const revealedTiles = this.state.board.reduce((memo, row) => {
        memo = memo.concat(row.filter((tile) => {
          return !tile.revealed;
        }));
        return memo;
      }, []);

      if (revealedTiles.length === this.props.numMines) {
        return this.props.onWin();
      }
    });
  }

  _placeMarker(column, row, event) {
    event.preventDefault();

    this.props.onTileRightClick();

    let board = this.state.board;
    board[column][row].flagged = true;

    this.setState({
      board: board
    });
  }

  render() {
    return (
      <div className="ms-game-board ms-retro-border-rev"
        style={this._getContainerStyle()}>
        {this._getRowsFrom(this.props.board)}
      </div>
    );
  }
}

Grid.propTypes = {
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  board: React.PropTypes.array,
  onTileClick: React.PropTypes.func,
  onTileRightClick: React.PropTypes.func,

};

export default Grid;
