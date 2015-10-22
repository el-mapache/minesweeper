import React from 'react';
import Grid from 'components/Grid';
import Scoreboard from 'components/Scoreboard';

export default class App extends React.Component {
	constructor(props) {
    super(props);

		// Could easily be passed in as props from a server
		this.state = this._getInitialState();

    this._incrementMoves = this._incrementMoves.bind(this);
    this._onLose = this._onLose.bind(this);
		this._onWin = this._onWin.bind(this);
		this._resetGame = this._resetGame.bind(this);
		this._tick = this._tick.bind(this);

		this._clock = null;
	}

	componentDidMount() {
		this._clock = setInterval(this._tick, 1000);
	}

	_tick() {
		if (!this.state.playing) {
			return;
		}

		this.setState({
			currentTime: this.state.currentTime + 1
		});
	}

	_getInitialState() {
		return {
			moves: 0,
			score: 0,
			playing: true,
			gameId: this._getGameId(),
			won: false,
			currentTime: 0
		};
	}

  _incrementMoves() {
    this.setState({
      moves: this.state.moves + 1
    });
  }

  _onLose() {
		clearInterval(this.clock);
		this.clock = null;

    this.setState({
      playing: false
    });
  }

	_onWin() {
		this.setState({
			playing: false,
			won: true
		});
	}

	_resetGame() {
		const nextGameState = this._getInitialState();
		this.setState(nextGameState);
	}

	_getGameId() {
		return `${+new Date}:${(Math.random() * 1000000) | 0}`; // no clue how unique this is
	}

	_getGameOverMessage() {
		if (!this.state.playing) {
			const resetButton = (<button onClick={this._resetGame}>restart</button>);
			let message = this.state.won ? 'YOU WIN!' : 'YOU LOSE, LOSER.';

			return (
				<div>
					<h1 className="ms-title">{message}</h1>
				</div>
			);
		}
		//<button onClick={this._resetGame}>restart</button>

		return (<h1 className="ms-title">MINESWEEPER</h1>);
	}

	render() {
		return (
			<div className="ms-game-container ms-retro-border">
				<div className="ms-info-pane">
					<Scoreboard score={this.state.moves} />
					{this._getGameOverMessage()}
					<Scoreboard score={this.state.currentTime} />
				</div>
      	<Grid key={this.state.gameId}
					playing={this.state.playing}
          onTileClick={this._incrementMoves}
          onLose={this._onLose}
					onWin={this._onWin} />
			</div>
		);
	}
}
