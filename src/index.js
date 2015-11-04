import React from 'react';
import Game from 'stores/Game';
import App from 'components/App';

React.render(<App {...Game.getState()}/>, document.getElementById('app'));
