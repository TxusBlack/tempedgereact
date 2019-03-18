import React from "react";
import ReactDOM from 'react-dom';
import Webcam from "react-webcam";
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import EventEmitter from 'events';
import FaceTracker from '../assets/tracking';
import '../assets/face.min.js';
import ModalConfirm from '../../Modals/FaceMashConfirm/Modal';
import ModalFail from '../../Modals/FaceMashFail/Modal';

const $ = window.$;

let canvas_width = 320;
let canvas_height: 240;

class FaceMashMobile extends React.Component {
  constructor(props){
    super(props);

    this.addTranslationsForActiveLanguage();
  }

  state = {
    initialized: 0,
    start: 0,
    delay: 5,  // <== Face Detection Time
    trackerTask: null,
    faceDetectTracker: null,
    faceDetected: false,
    play: null,
    stop: null,
    waitMsg: "",
    employeeName: "",
    timeStatus: ""
  };

  componentDidMount(){
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');
    let tracker = new window.tracking.ObjectTracker("face");
    let tracker2 = new window.tracking.ObjectTracker("face");

    this.setWaitMessage(this.state.delay);
    this.setState({
      waitMsg: `Please Wait.`,
      trackerTask: window.tracking.track('#facemash', tracker, { camera: true }),
      faceDetectTracker: window.tracking.track('#facemash', tracker2, { camera: true })
    }, () => {
      this.initFaceTracker(tracker, canvas, context, this.state.trackerTask);
      this.initFaceDetectTracker(tracker2, canvas, context, this.state.faceDetectTracker);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/snapshot-mobile/${this.props.activeLanguage.code}`);
      this.addTranslationsForActiveLanguage();
    }
  }

  addTranslationsForActiveLanguage() {
    const {activeLanguage} = this.props;

    if (!activeLanguage) {
      return;
    }

    import(`../../translations/${activeLanguage.code}.tempedge.json`)
      .then(translations => {
        this.props.addTranslationForLanguage(translations, activeLanguage.code)
      });
  }

  componentWillUnmount(){
    console.log("this.state.trackerTask: ", this.state.trackerTask);
    this.state.trackerTask.stop();
    this.state.faceDetectTracker.stop();
    this.state.trackerTask.events_.stopVideoFeed[0]();
  }

  //Set starting time for timer
  setTimerStart(){
    this.setState({
      start: Date.now()
    });
  }

  //Set trackers canvas width (area on which to detect a face and draw rectangles)
  setCanvasWidth(width){
    let canvas = document.getElementById('canvas');
    canvas.width = width;
  }

  //re-starts 1st tracker that finds a face
  reStartfaceDetectTracker(){
    this.state.faceDetectTracker.run();

    this.setState({
      waitMsg: 'Please Wait.'
    });
  }

  //re-starts 2nd tracker that takes picture
   reStartTracking = async () => {
    let delay = 3000;    //Delay before 'Please Wait' message gets replaced.

    //Set canvas width (default 320px) where trackers will detect faces and draw rectangles.
    this.setCanvasWidth(canvas_width);

    //If this is the first time the FaceMash component is loaded, set delay to zero.
    if(this.state.initialized < 1){
      await this.setState({
        initialized: 1
      }, () => {
        delay = 0;
      });
    }

    //Otherwise continue with the default delay of 3 secs.
    setTimeout(() => {
      this.setWaitMessage(this.state.delay);
      this.setTimerStart();
      this.state.trackerTask.run();
    }, delay)
  }

  //Change state for faceDetected
  resetFaceDetected(faceState){
    console.log("Resseting Face state to: ", faceState);

    //Stop first tracker given a feace has already been detected
    this.state.faceDetectTracker.stop();

    //Set faceDetected to true in the state
    this.setState({
      faceDetected: faceState
    }, () => {
      if(this.state.faceDetected){
          this.reStartTracking();   //re-start 2nd tracker to take picture
      }
    });
  }

  setWaitMessage = (sec) => {
    if(sec > 0){
      this.setState({ waitMsg: `Please stand still for ${sec} seconds.` });
    }else if(sec < 6){
      this.setState({ waitMsg: `` });
    }
  }

  //Open Login success/failure modals
  toggleModal(mode){
    if(mode > -1){
      this.setWaitMessage(0);
      this.resetFaceDetected(false);
      $(ReactDOM.findDOMNode(this.refs.faceMashConfirmModal)).modal();
    }else if(mode < 0){
      this.setWaitMessage(0);
      this.resetFaceDetected(false);
      $(ReactDOM.findDOMNode(this.refs.faceMashFailModal)).modal();
    }
  }

  setRef = webcam => {
    this.webcam =  webcam;
  };

  //Take user screenshot(s)
  capture = () => {
    let imageSrc = this.webcam.getScreenshot();
    return imageSrc;
  };

  //Init 1st tracker to detect face
  initFaceDetectTracker = (tracker, canvas, context, faceDetectTracker) => {
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);

    this.setTimerStart();
    let seconds = 0;
    let canvasWidth = canvas.width;

    tracker.on('track', event => {
      console.log("initFaceDetectTracker Running!");

      //This will kick in as soon as a face is detected
      event.data.forEach(rect => {

        //This will set faceDetected to true, given a face has already been detected
        if(!this.state.faceDetected){
          console.log("Face Detected!");

          this.resetFaceDetected(true);   //Set faceDetected to true.
        }
      })
    })
  }

  //Init 2nd tracker to take user picture
  initFaceTracker = (tracker, canvas, context, trackerTask) => {
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
        this.setState({ waitMsg: `Please stand still for ${parseInt(6-seconds)} seconds.` });

        if(seconds > this.state.delay){
          let imageSrc = this.capture();
          trackerTask.stop();
          this.setCanvasWidth(0);

          //CALL TO SERVER REST API
          // ...
          //***

          //ONCE CALL ON PROMISE SOLVED DO THIS:
          if(this.state.faceDetected){
            console.log("Success!");
            /*** ON SUCCESS ***/
            this.setState({
              employeeName: "Luis Diaz",
              timeStatus: "In"
            }, () => {
              this.toggleModal(0);   //Opens Sucess Modal
            });

            /*** ON FAIL ***/
            // this.setState({
            //   employeeName: "Luis Diaz",
            //   timeStatus: ""
            // }, () => {
            //   this.toggleModal(-1);   //Opens Fail Modal
            // });
            //*****
          }

          console.log("Canvas Width: ", canvasWidth);
          console.log("Captured Image: ", imageSrc);
        }

        context.strokeStyle = 'red';
        context.strokeRect(rect.x, rect.y, rect.width, rect.height);
      })
    })
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
            <h3 style={{textAlign: "center"}}>{this.state.waitMsg}</h3>
          </div>
        </div>
        <ModalConfirm title="TempEdge Time Track" employee={this.state.employeeName} timeStatus={this.state.timeStatus} reStartfaceDetectTracker={() => this.reStartfaceDetectTracker()} ref="faceMashConfirmModal" />
        <ModalFail title="TempEdge Time Track" employee={this.state.employeeName} reStartfaceDetectTracker={() => this.reStartfaceDetectTracker()} ref="faceMashFailModal" />
      </div>
    );
  }
}

export default withLocalize(connect(null, { push })(FaceMashMobile));
