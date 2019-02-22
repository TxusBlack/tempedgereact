import React from "react";
import ReactDOM from 'react-dom';
import Webcam from "react-webcam";
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import  { setActivePage } from '../../Redux/actions/tempEdgeActions';
import EventEmitter from 'events';
import FaceTracker from '../assets/tracking';
import '../assets/face.min.js';
import ModalConfirm from '../../Modals/FaceMashConfirm/Modal';
import ModalFail from '../../Modals/FaceMashFail/Modal';

const $ = window.$;

class FaceMash extends React.Component {
  constructor(props){
    super(props);
  }

  state = { start: 0, trackerTask: null, play: null, stop: null, waitMsg: "", employeeName: "", timeStatus: "" }

  componentDidMount(){
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');
    let tracker = new window.tracking.ObjectTracker("face");
    this.setWaitMessage(5);
    this.setState({
      trackerTask: window.tracking.track('#facemash', tracker, { camera: true })
    }, () => {
      this.initFaceTracker(tracker, canvas, context, this.state.trackerTask);
    });
  }

  componentWillUnmount(){
    console.log("this.state.trackerTask: ", this.state.trackerTask);
    this.state.trackerTask.stop();
    this.state.trackerTask.events_.stopVideoFeed[0]();
  }

  reStartTracking(){
    this.setTimerStart()
    this.setCanvasWidth(320);
    this.setWaitMessage(5);
    this.state.trackerTask.run();
  }

  setTimerStart(){
    this.setState({
      start: Date.now()
    });
  }

  setWaitMessage(sec){
    console.log("PLEASE WAIT!");
    this.setState({ waitMsg: `Please Wait.` });

    if(sec > 0){
      setTimeout(() => {
        this.setState({ waitMsg: `Please stand still for ${sec} seconds.` });
      }, 3000);
    }else if(sec < 6){
      this.setState({ waitMsg: `` });
    }
  }

  toggleModal(mode){
    if(mode > -1){
      console.log("SUCCESS!");
      this.setWaitMessage(0);
      $(ReactDOM.findDOMNode(this.refs.faceMashConfirmModal)).modal();
    }else if(mode < 0){
      console.log("FAIL");
      this.setWaitMessage(0);
      $(ReactDOM.findDOMNode(this.refs.faceMashFailModal)).modal();
    }
  }

  setRef = webcam => {
    this.webcam =  webcam;
  };

  capture = () => {
    let imageSrc = this.webcam.getScreenshot();
    return imageSrc;
  };

  initFaceTracker(tracker, canvas, context, trackerTask){
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);

    this.setTimerStart();
    let seconds = 0;
    let canvasWidth = canvas.width;

    tracker.on('track', event => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      event.data.forEach(rect => {
        // Calculate elapsed to tenth of a second:
        let elapsed = Math.round((new Date() - this.state.start) / 100);

        // This will give a number with one digit after the decimal dot (xx.x):
        seconds = (elapsed / 10).toFixed(1);

        console.log("start: ", this.state.start);
        console.log("elapsed: ", elapsed);
        console.log("secs: ", seconds);

        if(seconds > 5){
          let imageSrc = this.capture();
          trackerTask.stop();
          this.setCanvasWidth(0);

          //CALL TO SERVER REST API
          // ...
          //***

          //ONCE CALL ON PROMISE SOLVED DO THIS:

          /*** ON SUCCESS ***/
          this.setState({
            employeeName: "Luis Diaz",
            timeStatus: "In"
          }, () => {
            this.toggleModal(0);   //Opens Modal
          });

          /*** ON FAIL ***/
          // this.setState({
          //   employeeName: "Luis Diaz",
          //   timeStatus: ""
          // }, () => {
          //   this.toggleModal(-1);   //Opens Modal
          // });
          //*****

          console.log("Canvas Width: ", canvasWidth);
          console.log("Captured Image: ", imageSrc);
        }

        context.strokeStyle = 'red';
        context.strokeRect(rect.x, rect.y, rect.width, rect.height);
      })
    })
  }

  setCanvasWidth(width){
    let canvas = document.getElementById('canvas');
    canvas.width = width;
  }

  render() {
    let videoConstraints = {
      width: 320,
      height: 240,
      facingMode: "user"
    };

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8 col-md-offset-2">
            <div style={{height:40}}></div>
            <div style={{position: "relative", width: 320, height: 240, marginBottom:40}} className="center-block">
              <Webcam className="center-block"
                audio={false}
                height={240}
                id="facemash"
                ref={this.setRef}
                screenshotFormat="image/jpeg"
                width={320}
                videoConstraints={videoConstraints}
              />
              <canvas id="canvas" width="320" height="240" style={{position: "absolute", top: 0}}></canvas>
            </div>
            <h3 style={{textAlign: "center"}}>{this.state.waitMsg}</h3>
          </div>
        </div>
        <ModalConfirm title="TempEdge Time Track" employee={this.state.employeeName} timeStatus={this.state.timeStatus} reStartTracking={this.reStartTracking.bind(this)} ref="faceMashConfirmModal" />
        <ModalFail title="TempEdge Time Track" employee={this.state.employeeName} reStartTracking={this.reStartTracking.bind(this)} ref="faceMashFailModal" />
      </div>
    );
  }
}

export default withLocalize(connect(null)(FaceMash));
