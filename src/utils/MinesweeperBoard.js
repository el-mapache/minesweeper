import MinesweeperNode from 'utils/MinesweeperNode';

export default class MinesweeperBoard {
  constructor(rows, columns, mines) {
    this.rows = rows;
    this.columns = columns;
    this.mines = mines;
    this.size = (this.rows * this.columns) + 1;

    let board = this._getBoard();
    this._placeMines(board, this._getMines());

    this.board = board;
  }

  /**
   * Creates grid from the row and column props.
   * @returns {Array} board
  **/
  _getBoard() {
    let row = -1;
    let column = -1;
    let board = [];

    while((row = row + 1) < this.rows) {
      board[row] = [];

      while((column = column + 1) < this.columns) {
        board[row][column] = new MinesweeperNode();
      }

      // reset the column counter
      column = -1;
    }

    return board;
  }

  _getMines() {
    let numMines = this.mines;
    let point = null;
    let points = [];
    let spaces = {};

    if (numMines > this.size - 1) {
      throw new Error('Number of mines exceeds the size of the board.');
    }

    while (numMines--) {
      // _getRandomSpace returns null. As long as `point` is null we know
      // a unique random tile hasn't been found.
      while (point === null) {
        point = this._getRandomSpace(points);
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
    points.length = 0;

    return spaces;
  }

  /**
   * Get a point in the grid using a pseudorandom number. If the algorithm
   * has grabbed this point before, return null, otherwise, return the position
   * of the tile in the grid as an index of a 1d array.
   * @return {Number|null} Null or the 1d index of the point in the grid.
   */
  _getRandomSpace(points) {
    const randomPoint = (Math.random() * this.size) | 0;

    if (~points.indexOf(randomPoint)) {
      // This point in the grid has already been assigned a value.
      return null;
    }

    // Add the point to our list of used points.
    points.push(randomPoint);

    return randomPoint;
  }

  /**
   * Translate a 1d position in a grid to an x,y position.
   * @param  {Number}} point index in a 1d representation of the grid
   * @return {Object}        X/Y coordinate pair.
   */
  _getCoordsFromPoint(point) {
    const columns = this.columns;
    let coords = {};

    coords.x = point % columns;
    coords.y = (point / columns) | 0;

    return coords;
  }

  _placeMines(board, mines) {
    Object.keys(mines).forEach(function(row) {
      mines[row].forEach(function(tile) {
        board[row][tile].setValue('X');
      });
    });
  }
}
