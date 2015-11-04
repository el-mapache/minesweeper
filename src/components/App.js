import React from 'react';
import Game from 'stores/Game';
import Grid from 'components/Grid';
import Scoreboard from 'components/Scoreboard';

export default class App extends React.Component {
	constructor(props) {
    super(props);

    this._incrementMoves = this._incrementMoves.bind(this);
		this._decrementMarkers = this._decrementMarkers.bind(this);
    this._onLose = this._onLose.bind(this);
		this._onWin = this._onWin.bind(this);
		this._resetGame = this._resetGame.bind(this);
		this._tick = this._tick.bind(this);

		this._clock = null;
	}

	componentDidMount() {
		this._clock = setInterval(this._tick, 1000);
	}

	componentWillUnmount() {
		clearInterval(this._clock);
	}

	_tick() {
		if (!this.props.started || !this.props.playing) {
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
			currentTime: 0,
			markers: 99,
			started: false
		};
	}

	_decrementMarkers() {
		if (!this.state.markers) {
			return;
		}

		this.setState({
			markers: this.state.markers - 1
		});
	}

  _incrementMoves() {
    this.setState({
      moves: this.state.moves + 1,
			started: true
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
		if (!this.props.playing) {
			const resetButton = (<button onClick={this._resetGame}>restart</button>);
			let message = this.state.won ? 'YOU WIN!' : 'YOU LOSE, LOSER.';

			return (
				<div>
					<h1 className="ms-title">{message}</h1>
				</div>
			);
		}

		return (<h1 className="ms-title">MINESWEEPER</h1>);
	}

	render() {
		var width = this.props.columns * (this.props.tileSizePx + this.props.gutterPx);
		var height = this.props.rows * (this.props.tileSizePx + this.props.gutterPx)

		return (
			<div className="ms-game-container ms-retro-border">
				<div className="ms-info-pane">
					<Scoreboard score={this.props.markers} />
					{this._getGameOverMessage()}
					<Scoreboard score={this.props.currentTime} />
				</div>
				<button className="ms-reset-btn"
					style={{display: this.props.playing ? 'none' : 'initial'}}
					onClick={this._resetGame}>restart</button>
      	<Grid key={this.props.gameId}
				  width={width}
					height={height}
					playing={this.props.playing}
          onTileClick={this._incrementMoves}
					onTileRightClick={this._decrementMarkers}
          onLose={this._onLose}
					onWin={this._onWin}
					board={this.props.board} />
			</div>
		);
	}
}
