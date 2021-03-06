import React from 'react';
import Row from 'components/Row';
import FloodFill from 'utils/FloodFill';

let _points = [];

class Grid extends React.Component {
  constructor(props) {
    super(props);

    this._checkNeighbors = this._checkNeighbors.bind(this);
    this._placeMarker = this._placeMarker.bind(this);

    // generate the board object.
    let board = this._getBoard();
    const mines = this._getMines();

    // perform a second pass over the board and place bombs
    this._placeMines(board, mines);

    this.state = {
      board: board
    };
  }

  /**
   * Creates grid from the row and column props.
   * @returns {Array} board
  **/
  _getBoard() {
    const columns = this.props.columns;
    const rows = this.props.rows;

    let row = -1;
    let column = -1;
    let board = [];

    while((row = row + 1) < rows) {
      board[row] = [];

      while((column = column + 1) < columns) {
        board[row][column] = {
          value: null,
          revealed: false,
          flagged: false
        };
      }

      // reset the column counter
      column = -1;
    }

    return board;
  }

  _getRows() {
    const _this = this;

    let row = 0;
    let output = [];

    for (row; row < this.props.rows; row++) {
      const ref = 'Row' + row;

      output.push(
        <Row key={row}
          data={_this.state.board[row]}
          ref={ref}
          index={row}
          onTileClick={_this._checkNeighbors}
          onRightClick={this._placeMarker} />
      );
    }

    return output;
  }

  _getContainerStyle() {
    const width = `${this.props.columns * (this.props.tileSize +
                                           this.props.gutter)}px`;

    const height = `${this.props.rows * (this.props.tileSize + this.props.gutter)}`;

    return {
      'height': height,
      'width': width
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

  _getMines() {
    let numMines = this.props.numMines;
    let point = null;
    let spaces = {};

    while (numMines--) {
      // _getRandomSpace returns null. As long as `point` is null we know
      // a unique random tile hasn't been found.
      while (point === null) {
        point = this._getRandomSpace();
      }

      const coords = this._getCoordsFromPoint(point);

      // If we have seen this row, assign it our variable,
      // otherwise initialize it with an empty array.
      let row = spaces[coords.y] = spaces[coords.y] || [];


      // Add the new mine tile to its row.
      row.push(coords.x);

      // zero out point so while loop generates a new random point.
      point = null;
    }

    // zero out the points array
    _points.length = 0;

    return spaces;
  }

  /**
   * Get a point in the grid using a pseudorandom number. If the algorithm
   * has grabbed this point before, return null, otherwise, return the position
   * of the tile in the grid as an index of a 1d array.
   * @return {Number|null} Null or the 1d index of the point in the grid.
   */
  _getRandomSpace() {
    // Add one to make our random number generator inclusive.
    const gridSize = (this.props.rows * this.props.columns);
    const randomPoint = (Math.random() * gridSize) | 0;

    if (~_points.indexOf(randomPoint)) {
      // This point in the grid has already been assigned a value.
      return null;
    }

    // Add the point to our list of used points.
    _points.push(randomPoint);

    return randomPoint;
  }

  /**
   * Translate a 1d position in a grid to an x,y position.
   * @param  {Number}} point index in a 1d representation of the grid
   * @return {Object}        X/Y coordinate pair.
   */
  _getCoordsFromPoint(point) {
    const columns = this.props.columns;
    let coords = {};

    coords.x = point % columns;
    coords.y = (point / columns) | 0;

    return coords;
  }

  _placeMines(board, mines) {
    Object.keys(mines).forEach(function(row) {
      mines[row].forEach(function(tile) {
        board[row][tile].value = 'X';
      });
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
        {this._getRows()}
      </div>
    );
  }
}

Grid.propTypes = {
  rows: React.PropTypes.number,
  columns: React.PropTypes.number,
  onTileClick: React.PropTypes.func,
  onTileRightClick: React.PropTypes.func
};

Grid.defaultProps = {
  rows: 16,
  columns: 30,
  tileSize: 20,
  gutter: 4,
  // TODO instead of doing this, make the grid more generic and have the
  // minesweeper board inherit from this component.
  numMines: 70
};

export default Grid;
