/* import libs */
import * as ws from './websocket-min';
/* import action */
import { changeSimulator } from '../actions/index'
let store;

export function createWs(secure, host, port, s) {
    store = s;
    ws.wsclient.create({ secure: secure, host: host, port: port });
    setTimeout(()=>{
        ws.wsclient.bind('/data/myotonometer', (r, e)=>{}, (push_message)=>{
            if (push_message.action === 'modify'){
                store.dispatch(changeSimulator(push_message.content));
            }
        });
    },1000);
}
/**
 * Change value in DB ( /data/controller/status )
 * @param  {int} status      Integer define status of measurement
 */
export function modifySimulatorStatus(status) {
    ws.wsclient.modify('/data/myotonometer', {status: status, writer: 1}, (response, error) => {
        if (error.status === 0){
            store.dispatch(changeSimulator(response));
        } else {
            console.log(error.status);
        }
    });
}
/**
 * Change value in DB ( /data/controller/progress )
 * @param  {int} progress      progress bar value
 */
export function modifySimulatorProgress(progress) {
    ws.wsclient.modify('/data/myotonometer', {progress: progress, writer: 1}, (response, error) => {
        if (error.status === 0){
            store.dispatch(changeSimulator(response));
        } else {
            console.log(error.status);
        }
    });
}
/**
 * Change value in DB ( /data/controller/ )
 * @param  {Object} Obj      object of value
 */
export function modifySimulator(obj) {
    ws.wsclient.modify('/data/myotonometer', obj, (response, error) => {
        if (error.status === 0){
            store.dispatch(changeSimulator(response));
        } else {
            console.log(error.status);
        }
    });
}
export function get() {
    ws.wsclient.get('/data/myotonometer', '*', (r,e)=>{console.log('get',r);});
}