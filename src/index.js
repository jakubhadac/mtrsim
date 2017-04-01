/* import libs */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
/* import pages */
import App from './common/Simulator';
/* create global State store */
import simulApp from './common/reducers/index';
let store = createStore(simulApp);
/* open ws connection */
import * as ws from './common/services/index';
ws.createWs( false, "marble.cz", 8080, store);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.getElementById('root') );