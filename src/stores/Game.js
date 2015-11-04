import assign from 'object-assign';
import Events from 'events';
import MinesweeperBord from 'utils/MinesweeperBoard';

const Emitter = Events.EventEmitter;
const CHANGE_EVENT = 'change';

const hasKey = function(key) {
  return key in _state;
};

const getDefaultState = function() {
  const state = {
    rows: 16,
    columns: 30,
    mines: 68,
    tileSizePx: 20,
    gutterPx: 4,
    moves: 0,
    currentTime: 0,
    isPlaying: true,
    won: false,
    gameId: `${+new Date}:${(Math.random() * 1000000) | 0}`,
    board: new MinesweeperBord(_state.rows, _state.columns, _state.mines)
  };

  return state;
};

let _state = getDefaultState();
let board;

const Game = assign({}, Emitter.prototype, {
  getState() {
    return _state;
  },

  setState(prop, value) {
    if (typeof prop === 'object' && prop) {
      let validStateKeys = Object.keys(state);

      for (let property in prop) {
        if (validStateKeys.indexOf(property)) {
          _state[property] = prop[property];
        }
      }
    } else if (stateHasKey(prop)) {
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
