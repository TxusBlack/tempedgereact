import React from "react";
import ReactDOM from 'react-dom';
import Webcam from "react-webcam";
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import  { setActivePage } from '../../Redux/actions/tempEdgeActions';
import Tracker from '../assets/tracking';
import ModalConfirm from '../../Modals/FaceMashConfirm/Modal';
import ModalFail from '../../Modals/FaceMashFail/Modal';

const $ = window.$;

let canvas_width = 320;
let canvas_height: 240;

class FaceMashDesktop extends React.Component {
  state = {
    employeeName: "",
    timeStatus: "",
    trackerTask: null
  };

  componentDidMount(){
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');
    let tracker = new window.tracking.ObjectTracker("face");      //Tracker, canvas and context are needed to turn off the camera on componentUnmount

    this.setState({
      trackerTask: window.tracking.track('#facemash', tracker, { camera: true })
    });
  }

  componentWillUnmount(){
    this.state.trackerTask.events_.stopVideoFeed[0]();
  }

  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => {
    let imageSrc = this.webcam.getScreenshot();

    //CALL TO SERVER REST API
    // ...
    //***

    //ONCE CALL ON PROMISE SOLVED DO THIS:

    /*** ON SUCCESS ***/
    this.setState({
      employeeName: "Luis Diaz",
      timeStatus: "In"
    }, () => {
      this.toggleModal(0);   //Opens Sucess Modal
    });

    /*** ON FAIL ***/
    // this.setState({
    //   employeeName: "Luis Diaz"
    // }, () => {
    //   this.toggleModal(-1);   //Opens Fail Modal
    // });
  };

  //Open Login success/failure modals
  toggleModal(mode){
    if(mode > -1){
      $(ReactDOM.findDOMNode(this.refs.faceMashConfirmModal)).modal();
    }else if(mode < 0){
      $(ReactDOM.findDOMNode(this.refs.faceMashFailModal)).modal();
    }
  }

  render() {
    let videoConstraints = {
      width: canvas_width,
      height: canvas_height,
      facingMode: "user"
    };

    return(
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8 col-md-offset-2">
            <div style={{height:40}}></div>
            <div style={{position: "relative", width: videoConstraints.width, height: videoConstraints.height, marginBottom:40}} className="center-block">
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
            <button className="btn btn-default phone-num-btn-close center-block" onClick={this.capture}>Capture photo</button>
            <ModalConfirm title="TempEdge Time Track" employee={this.state.employeeName} timeStatus={this.state.timeStatus} reStartfaceDetectTracker={null} ref="faceMashConfirmModal" />
            <ModalFail title="TempEdge Time Track" employee={this.state.employeeName} reStartfaceDetectTracker={null} ref="faceMashFailModal" />
          </div>
        </div>
      </div>
    );
  }
}

export default withLocalize(connect(null)(FaceMashDesktop));
