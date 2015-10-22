class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

export default class MinesweeperNode extends Point {
  constructor(x, y) {
    super(x, y);

    this.value = null;
    this.revealed = null;
    this.nearbyMines = null;
  }

  setValue(value, revealed = false) {
    this.value = value;
    this.revealed = revealed;
  }
}
