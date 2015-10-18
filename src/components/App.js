import React from 'react';
import Grid from 'components/Grid';

export default class App extends React.Component {
	constructor(props) {
    super(props);

		// Could easily be passed in as props from a server
		this.state = this._getInitialState();

    this._incrementMoves = this._incrementMoves.bind(this);
    this._onLose = this._onLose.bind(this);
		this._onWin = this._onWin.bind(this);
		this._resetGame = this._resetGame.bind(this);
	}

	_getInitialState() {
		return {
			moves: 0,
			score: 0,
			playing: true,
			gameId: this._getGameId(),
			won: false
		};
	}

  _incrementMoves() {
    this.setState({
      moves: this.state.moves + 1
    });
  }

  _onLose() {
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
		return `${+new Date}:${Math.random() * 10000}`; // no clue how unique this is
	}

	_getGameOverMessage() {
		if (!this.state.playing) {
			if (this.state.won) {
				return (
					<div>
						<h1>YOU WIN!</h1>
						<button onClick={this._resetGame}>restart</button>
					</div>
				);
			}

			return (
				<div>
					<h1>GAME OVER!</h1>
					<button onClick={this._resetGame}>restart</button>
				</div>
			);
		}

		return null;
	}

	render() {
		return (
			<div>
				{this._getGameOverMessage()}
				<span>Number of moves: {this.state.moves}</span>
      	<Grid key={this.state.gameId}
					playing={this.state.playing}
          onTileClick={this._incrementMoves}
          onLose={this._onLose}
					onWin={this._onWin} />
			</div>
		);
	}
}
