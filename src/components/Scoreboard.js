import React from 'react';

class Scoreboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hundreds: 0,
      tens: 0,
      ones: 0
    };
  }

  _padLeft() {
    const score = this.props.score;
    let output;

    if (score < 10) {
      output = `00${score}`;
    } else if (score >= 10 && score < 100) {
      output = `0${score}`;
    } else {
      output = `${score}`;
    }

    return output;
  }

  componentWillReceiveProps() {
    const digits = this._padLeft(this.props.score).split('');

    this.setState({
      hundreds: digits[0],
      tens: digits[1],
      ones: digits[2]
    })
  }

  render() {
    return (
			<div className="ms-retro-box ms-retro-border">
        <div className="ms-retro-content">
          <span className="ms-tech-display-glyph">{this.state.hundreds}</span>
          <span className="ms-tech-display-glyph">{this.state.tens}</span>
          <span className="ms-tech-display-glyph">{this.state.ones}</span>
        </div>
      </div>
    );
  }
}

Scoreboard.propTypes = {
  score: React.PropTypes.number
};

export default Scoreboard;
