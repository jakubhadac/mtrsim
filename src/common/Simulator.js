/* import libs */
import React from 'react';
import { connect } from 'react-redux';
/* import */
import * as ws from './services/index';
/* map functions */
function mapStateToProps(store) {
    return { status: store.simulator.status, progress: store.simulator.progress};
}

class Simulator extends React.Component {
    constructor(){
        super();

        this.state = {move: 'none', chartData: []};
        this.startBtn = this.startBtn.bind(this);
        this.createMeas = this.createMeas.bind(this);
    }
    startBtn(){
        if (this.props.status === 1){
            ws.modifySimulatorStatus(2);
            this.setState({move: 'down'});
            this.moveTimeDown(0);
        }
    }
    createMeas(){ ws.modifySimulatorStatus(1); }
    moveTimeUp(time){
        ws.modifySimulatorProgress(time);
        if (time === 0){
            let data=this.createData();
            this.setState({move: 'nope', chartData: data});
            ws.modifySimulator({progress: 0, status: 0});
        }else{
            setTimeout(()=>{ this.moveTimeUp(time-2); },1000);
        }
    }
    moveTimeDown(time){
        ws.modifySimulatorProgress(time);
        if (time === 10){
            this.setState({move: 'up'});
            this.moveTimeUp(time);
        }else{
            setTimeout(()=>{ this.moveTimeDown(time+1); },1000);
        }
    }
    createData() {
        let ar = [], lenght = Math.floor(Math.random() * 20) + 5 ;
        for (let i=0; i<lenght; i++){ ar.push(Math.random()*Math.round(Math.random()*100)); }
        return ar;
    }
    render() {
        const statusText = ['Waiting for new measurement', 'Press start btn', 'Measurement in progress...'];
        const noProgress = (
            <fieldset>
                <legend>Myotonometr simulator</legend>
                <small>Data obtained only one who started measurements</small>
                <p>Status: {statusText[this.props.status]}</p>
                <p>Move: nope</p>
                <p>Chart data: {this.state.chartData.length !== 0? this.state.chartData.join(' ; '): 'none'}</p>

                <button onClick={this.startBtn} disabled={(this.props.status !== 1)? true: false}>Start</button>
                <button onClick={this.createMeas} disabled={(this.props.status !== 0)? true: false}>Create meas</button>
            </fieldset>
        );
        const withProgress = (
            <fieldset>
                <legend>Myotonometr simulator</legend>
                <p>Status: {statusText[this.props.status]}</p>
                <p>Move: TOP <progress value={this.props.progress} max="10" /> BOTTOM </p>

            </fieldset>
        );
        const render = (this.props.status === 2)? withProgress: noProgress;
        return ( render );
    }
}
export default connect(mapStateToProps)(Simulator);