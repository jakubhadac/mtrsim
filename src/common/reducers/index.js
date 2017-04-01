/* import libs */
import { combineReducers } from 'redux';
/* import reducers */
import simulator from './simulator';

const simulApp = combineReducers({
    simulator
});
export default simulApp;