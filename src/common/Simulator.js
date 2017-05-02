/* import libs */
import React from 'react';
import { connect } from 'react-redux';
/* import */
import * as ws from './services/index';
/* map functions */
function mapStateToProps(store) { return { sim: store.simulator }; }

class Simulator extends React.Component {
    constructor(){
        super();

        this.state = {move: 'none', chartData: []};
        this.startBtn = this.startBtn.bind(this);
        this.createMeas = this.createMeas.bind(this);
    }
    componentDidUpdate(){
        if (this.props.sim.status === 2 && this.props.sim.writer === 0){
            ws.modifySimulator({writer: 1, progress: 0});
            this.setState({move: 'down'});
            this.moveTimeDown(0);
        }
    }
    startBtn(){
        if (this.props.sim.status === 1){
            ws.modifySimulator({status: 2, writer: 1, progress: 0});
            this.setState({move: 'down'});
            this.moveTimeDown(0);
        }
    }
    createMeas(){ ws.modifySimulator( {status: 1, writer: 1, speed: 5, depth: 5, progress: 0} ); }
    moveTimeUp(time){
        let pro = 100 - time*4;
        ws.modifySimulator({progress: pro});
        if (time === 0){
            let data = this.createData();
            this.setState({move: 'nope', chartData: data});
            ws.modifySimulator({status: 0, writer: 1, progress: 100, data: data});
        }else{
            setTimeout(()=>{ this.moveTimeUp(time-2); },1000);
        }
    }
    meas(){
        ws.modifySimulator({status: 3, writer: 1, progress: 40});
        let time = Math.round(this.props.sim.depth / this.props.sim.speed);
        setTimeout(()=>{
            this.setState({move: 'up'});
            ws.modifySimulator({status: 4, writer: 1, progress: 60});
            this.moveTimeUp(10);
        },time*1000);
    }
    moveTimeDown(time){
        ws.modifySimulator({progress: time*4});
        if (time === 10) { this.meas(); }
        else { setTimeout(()=>{ this.moveTimeDown(time+1); },1000); }
    }
    createData() {
        let ar = [], lenght = Math.floor(Math.random() * 20) + 5 ;
        for (let i=0; i<lenght; i++){ ar.push(Math.random()*Math.round(Math.random()*100)); }
        return ar;
    }
    render() {
        console.log(this.props.sim)
        const statusText = ['Waiting for new measurement', 'Press start btn', 'Measurement in progress(move down)',
            'Measurement in progress(measurement)', 'Measurement in progress(move up)'];
        const noProgress = (
            <fieldset>
                <legend>Myotonometer simulator</legend>
                <p>Status: {statusText[this.props.sim.status]}</p>
                <p>Chart data: {this.state.chartData.length !== 0? this.state.chartData.join(' ; '): 'none'}</p>

                <button onClick={this.startBtn} disabled={(this.props.sim.status !== 1)? true: false}>Start</button>
                <button onClick={this.createMeas} disabled={(this.props.sim.status !== 0)? true: false}>Create meas</button>
            </fieldset>
        );
        const withProgress = (
        <fieldset>
            <legend>Myotonometer simulator</legend>
            <p>Status: {statusText[this.props.sim.status]}</p>
            <p>Profile: {this.props.sim.profile}, speed: {this.props.sim.speed}, depth: {this.props.sim.depth},
                indentor: {this.props.sim.indentor} </p>
            <p>Progress: <progress value={this.props.sim.progress} max="100" /></p>

        </fieldset>
        );
        const render = (this.props.sim.status >= 2)? withProgress: noProgress;
        return ( render );
    }
}
export default connect(mapStateToProps)(Simulator);