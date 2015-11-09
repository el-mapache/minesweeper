import React from 'react';

class Scoreboard extends React.Component {
  constructor(props) {
    super(props);

    const digits = this._padLeft(props.score).split('');

    this.state = {
      hundreds: digits[0],
      tens: digits[1],
      ones: digits[2]
    };
  }

  _padLeft(score) {
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

  componentWillReceiveProps(nextProps) {
    const digits = this._padLeft(nextProps.score).split('');

    this.setState({
      hundreds: digits[0],
      tens: digits[1],
      ones: digits[2]
    });
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
