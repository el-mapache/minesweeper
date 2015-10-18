/**
  var node = {};
  - node.mineCount -> starts at zero.
  - when algorithm reaches a mine, this gets incremented and
  the recursive search on that 'path' ends. Each node still needs to
  wait for all its other paths to report back.

for every position on board:
  1). check each of the 8 neighbors.
  2). if any of those neighbors is a mine, stop; dont reveal any surrounding nodes.
  3). for each negighbor that is a mine, increment mine count by 1



// stack based recursive

// in this case, we need a way to determine if the space has been checked
Flood-fill (node, target-color, replacement-color):
1. If target-color is equal to replacement-color, return.
2. If the color of node is not equal to target-color, return.
3. Set the color of node to replacement-color.
4. Perform Flood-fill (one step to the west of node, target-color, replacement-color).
  Perform Flood-fill (one step to the east of node, target-color, replacement-color).
  Perform Flood-fill (one step to the north of node, target-color, replacement-color).
  Perform Flood-fill (one step to the south of node, target-color, replacement-color).
5. Return.


**/
const FloodFill = (grid, x, y) => {
  let checked = [];
  let pending = [];
  let revealed = [];

  // is the current tile marked as a mine?
  const isMine = function(nodeValue) {
    return nodeValue === 'X';
  };

  // determine if a given node has already been looked at on this pass
  // through the algorithm.
  const tileIsChecked = function(node) {
    const length = checked.length;

    if (!length) {
      return;
    }

    let iterator = 0;

    for (iterator; iterator < length; iterator++) {
      const thisNode = checked[iterator];

      if (node.x === thisNode.x && node.y === thisNode.y) {
        return true;
      }
    }

    return false;
  };

  const Node = function(x, y) {
    this.x = x;
    this.y = y;
  };

  const inBounds = function(x,y) {
    if ((x > grid.length - 1) || (y > grid[0].length -1) || x < 0 || y < 0) {
      return false;
    }

    return true;
  }

  const addNeighbors = function(x, y) {
    // return if position is out of bounds.
    if (!inBounds(x,y)) {
      return;
    }

    const valueAtPoint = grid[x][y].value;

    if (isMine(valueAtPoint)) {
      grid[x][y].revealed = true;
      return;
    }

    if (valueAtPoint === 'O') {
      // this spot has already been revealed, skip it
      return;
    }

    let node = new Node(x, y);

    if (!tileIsChecked(node)) {
      checked.push(node)
    }

    pending = pending.concat([
      new Node(x, y - 1), // north
      new Node(x, y + 1), // south
      new Node(x + 1, y), // east
      new Node(x - 1, y), // west
      new Node(x - 1, y - 1),
      new Node(x - 1, y + 1),
      new Node(x + 1, y -1),
      new Node(x + 1, y + 1)
    ]);

    grid[x][y].value = 'O';

    let nextNode;

    while (nextNode = pending.pop()) {
      if (!inBounds(nextNode.x, nextNode.y)) {
        continue;
      }

      const next = grid[nextNode.x][nextNode.y];

      if(!isMine(next.value)) {
        next.value = 'O';
        next.revealed = true;
      }
      //if (!addNeighbors(nextNode.x, nextNode.y)) {
    //    break;
    //  }
    }
  };

  addNeighbors(x, y);
};

export default FloodFill;
