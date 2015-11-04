/**
for every position on board:
  1). check each of the 8 neighbors.
  2). if any of those neighbors is a mine, stop; dont reveal any surrounding nodes.
  3). for each negighbor that is a mine, increment mine count by 1
  4). otherwise, keep checking tiles.
**/
const FloodFill = (grid, x, y) => {
  let checked = [];

  // is the current tile marked as a mine?
  const isMine = function(nodeValue) {
    return nodeValue === 'X';
  };

  // determine if a given node has already been looked at on this pass
  // through the algorithm.
  const nodeIsChecked = function(node) {
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

  const inBounds = function(x, y) {
    if ((x > grid.length - 1) || (y > grid[0].length -1) || x < 0 || y < 0) {
      return false;
    }

    return true;
  }

  const addNeighbors = (x, y) => {
    let neighbors = [];

    if (!inBounds(x,y)) {
      // We are trying to access a node that is out of the bounds of the grid
      return;
    }

    const thisNode = grid[x][y];

    // What state the current node is in. e.g. mine, safe square, or unchecked
    const valueAtPoint = thisNode.value;

    if (isMine(valueAtPoint)) {
      // We've hit a mine, reveal it and stop the algorithm on this node's path
      thisNode.revealed = true;
      return;
    }

    if (valueAtPoint === 'O') {
      // This spot is safe and has been revealed, end this node's path
      return;
    }

    // Create a new minesweeper object
    let node = new Node(x, y);

    if (!nodeIsChecked(node)) {
      // Mark this tile as checked so we dont examine it in the future.
      checked.push(node)
    }

    neighbors = neighbors.concat([
      new Node(x, y - 1), // north
      new Node(x, y + 1), // south
      new Node(x + 1, y), // east
      new Node(x - 1, y), // west
      new Node(x - 1, y - 1),
      new Node(x - 1, y + 1),
      new Node(x + 1, y -1),
      new Node(x + 1, y + 1)
    ].filter((item) => {
      return inBounds(item.x, item.y);
    }));

    // If the current node being examined has been marked, we can reveal keep
    // checking its node path. However, we shouldn't toggle it to revealed,
    // and we shouldn't let the player know how many mines are around it.
    if (!thisNode.flagged) {
      // the current minesweeper hasn't found a mine, reveal it and mark as safe.
      thisNode.value = 'O';
      thisNode.revealed = true;
    }

    // Next, check to see of any of the 8 neighboring nodes are mines.
    var hasMines = neighbors.filter(function(neighbor) {
      return isMine(grid[neighbor.x][neighbor.y].value);
    })


    if (hasMines.length) {
      // The current node has mines for neighbors. Store the number and end
      // the algorithm on this node path.
      if (!thisNode.flagged) {
        thisNode.mineCount = hasMines.length;
      }

      return;
    }

    let nextNode;

    // Call addNeighbors on each of the 8 neighbors to see how many more
    // spaces we can reveal.
    while (nextNode = neighbors.pop()) {
      addNeighbors(nextNode.x, nextNode.y);
    }
  };

  addNeighbors(x, y);
};

export default FloodFill;
