import React from 'react';
import Grid from 'components/Grid';

export default class App extends React.Component {
	constructor(props) {
    super(props);

		this.state = {
			moves: 0,
			score: 0
		};

    this._incrementMoves = this._incrementMoves.bind(this);
	}

  _incrementMoves() {
    this.setState({
      moves: this.state.moves + 1
    });
  }

	render() {
		return (
			<div>
				<span>Number of moves: {this.state.moves}</span>
      	<Grid gameInProgress={true} onTileClick={this._incrementMoves} />
			</div>
		);
	}
}
