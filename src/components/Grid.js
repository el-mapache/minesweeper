import React from 'react';
import Row from 'components/Row';
import FloodFill from 'utils/FloodFill';
import Instrument from 'utils/Instrument';


// _filledSlots will be an object with rows as keys,
// and values of tiles with in the row.
let _filledSlots = {};
let _points = [];

class Grid extends React.Component {
  constructor(props) {
    super(props);
    this._checkNeighbors = this._checkNeighbors.bind(this);

    // generate the board object.
    let board = this._getBoard();


    const mines = this._getMines();

    // perform a second pass over the board and place bombs
    this._placeMines(board);

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
          revealed: false
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
          onTileClick={_this._checkNeighbors} />
      );
    }

    return output;
  }

  _getContainerStyle() {
    const width = `${this.props.columns * (this.props.tileSize +
                                           this.props.gutter)}px`;

    const height = `${this.props.rows * (this.props.tileSize + this.props.gutter)}`;

    return {
      'width': width,
      'border': '1px solid gray',
      'height': height,
      'padding': '4px'
    };
  }

  _checkNeighbors(row, column) {
    this.props.onTileClick();
    // create a copy of the board so we can mutate it freely
    let newBoard = this.state.board.slice();
    let neighbors = [];

    // the first node to check.
    let node = newBoard[row][column];

    node.revealed = true;
    // call the flood fill algorithm
    FloodFill(newBoard, row, column);

    console.log(newBoard);
    this.setState({
      board: newBoard
    });
  }

  _getMines() {
    let numMines = this.props.numMines;
    let point = null;

    while (numMines--) {
      // _getRandomSpace returns null. As long as `point` is null we know
      // a unique random tile hasn't been found.
      while (point === null) {
        point = this._getRandomSpace();
      }

      const coords = this._getCoordsFromPoint(point);

      // If we have seen this row, assign it our variable,
      // otherwise initialize it with an empty array.
      let row = _filledSlots[coords.y] = _filledSlots[coords.y] || [];


      // Add the new mine tile to its row.
      row.push(coords.x);

      // zero out point so while loop generates a new random point.
      point = null;
    }

    // zero out the points array
    _points.length = 0;
  }

  /**
   * Get a point in the grid using a pseudorandom number. If the algorithm
   * has grabbed this point before, return null, otherwise, return the position
   * of the tile in the grid as an index of a 1d array.
   * @return {Number|null} Null or the 1d index of the point in the grid.
   */
  _getRandomSpace() {
    // Add one to make our random number generator inclusive.
    const gridSize = (this.props.rows * this.props.columns) + 1;
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

  _placeMines(board) {
    Object.keys(_filledSlots).forEach(function(row) {
      _filledSlots[row].forEach(function(tile) {
        board[row][tile].value = 'X';
      });
    });
  }

  render() {
    return (
      <div style={this._getContainerStyle()}>
        {this._getRows()}
      </div>
    );
  }
}

Grid.propTypes = {
  rows: React.PropTypes.number,
  columns: React.PropTypes.number
};

Grid.defaultProps = {
  rows: 16,
  columns: 30,
  tileSize: 20,
  gutter: 4,
  // TODO instead of doing this, make the grid more generic and have the
  // minesweeper board inherit from this component.
  numMines: 50
};

export default Grid;
