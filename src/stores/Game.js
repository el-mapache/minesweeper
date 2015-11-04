import assign from 'object-assign';
import Events from 'events';
import MinesweeperBord from 'utils/MinesweeperBoard';

const Emitter = Events.EventEmitter;
const CHANGE_EVENT = 'change';
const MINES = 70;
const ROWS = 16;
const COLS = 30;

let dirty = false;


const hasKey = function(key) {
  return key in _state;
};

const getDefaultState = function() {
  const state = {
    rows: ROWS,
    columns: COLS,
    mines: MINES,
    tileSizePx: 20,
    gutterPx: 4,
    moves: 0,
    currentTime: 0,
    playing: true,
    markers: 99,
    started: false,
    won: false,
    gameId: `${+new Date}:${(Math.random() * 1000000) | 0}`,
    board: new MinesweeperBord(ROWS, COLS, MINES)
  };

  return state;
};

let _state = getDefaultState();
let board;

const Game = assign({}, Emitter.prototype, {
  populate(options) {

  },

  getState() {
    return _state;
  },

  update(prop, value) {
    if (typeof prop === 'object' && prop) {
      for (let property in prop) {
        _state[property] = prop[property];
      }
    } else {
      _state[prop] = value;
    }

    Game.emit(GAME.CHANGE_EVENT);
  }
});

Object.defineProperty(Game, 'CHANGE_EVENT', {
  enumerable: true,
  writable: false,
  value: 'change'
});

export default Game;
