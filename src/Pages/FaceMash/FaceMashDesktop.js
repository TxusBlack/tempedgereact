import React from "react";
import ReactDOM from 'react-dom';
import Webcam from "react-webcam";
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import Tracker from '../assets/tracking';
import ModalConfirm from '../../Modals/FaceMashConfirm/Modal';
import ModalFail from '../../Modals/FaceMashFail/Modal';
import PicModal from '../../Modals/PicModal/PicModal';
import ActiveLanguageAddTranslation from '../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import httpService from '../../utils/services/httpService/httpService.js';
import JSOG from 'jsog';

const $ = window.$;

let canvas_width = 480;
let canvas_height: 480;

class FaceMashDesktop extends React.Component {
  constructor(props){
    super(props);

    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
  }

  state = {
    imgCollection: [],
    currentImage: null,
    picWall: [],
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

  componentDidUpdate(prevProps, prevState) {
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/snapshot-desktop/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }
  }

  componentWillUnmount(){
    this.state.trackerTask.events_.stopVideoFeed[0]();
  }

  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => {
    let imageSrc = this.state.imgCollection;
    let currentImage = this.webcam.getScreenshot();

    console.log("currentImage: ", currentImage);

    if(imageSrc.length < 3){
      imageSrc.push(currentImage);

      this.setState({
        imgCollection: imageSrc,
        currentImage: currentImage
      }, () => {
        $(ReactDOM.findDOMNode(this.refs.picModal)).modal();
      });
    }else{

    }
  }

  mountPic = () => {
    let picWall = this.state.picWall;
    let picElement = (
      <div className="col-md-6">
        <img src={this.state.currentImage} style={{width: "100%", maxHeight: 300, margin: "auto", marginBottom: 20}}/>
      </div>
    );

    picWall.push(picElement);
    this.setState({
      picWall: picWall
    });
  }

  removePic = () => {
    let currentPicIndex = this.state.imgCollection.indexOf(this.state.imgCollection);
    let imageCollection = this.state.imgCollection;

    if (currentPicIndex > -1) {
      imageCollection.splice(currentPicIndex, 1);

      this.setState({
        imgCollection: imageCollection
      });
    }
  }

  onSubmit = async (formValues) => {
    let res = await httpService.postImages('/faceRecognition/saveNewSubject', this.state.imgCollection);
    console.log('response: ', res);

    this.fireNotification();
  }

    //ONCE CALL ON PROMISE SOLVED DO THIS:

    /*** ON SUCCESS ***/
    // this.setState({
    //   employeeName: "Luis Diaz",
    //   timeStatus: "In"
    // }, () => {
    //   this.toggleModal(0);   //Opens Sucess Modal
    // });

    /*** ON FAIL ***/
    // this.setState({
    //   employeeName: "Luis Diaz"
    // }, () => {
    //   this.toggleModal(-1);   //Opens Fail Modal
    // });
  //};

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

    let tempEdgeSubmitShow = (this.state.imgCollection.length < 3)? '': <button className="btn btn-primary phone-num-btn-close center-block" onClick={this.onSubmit}>Submit</button>;

    return(
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-5">
            <div style={{height:40}}></div>
            <div style={{position: "relative", width: videoConstraints.width, height: videoConstraints.height}} className="center-block">
              <Webcam className="center-block"
                audio={false}
                height={480}
                id="facemash"
                ref={this.setRef}
                screenshotFormat="image/jpeg"
                width={480}
                videoConstraints={videoConstraints}
              />
              <canvas id="canvas" width="320" height="240" style={{position: "absolute", top: 0}}></canvas>
            </div>
            <button className="btn btn-default phone-num-btn-close center-block" onClick={this.capture}>Capture photo</button><br/><br/>
            {tempEdgeSubmitShow}
          </div>
          <div className="col-md-7">
            <div style={{border: "1px solid black", padding:40, minHeight:'calc(100vh - 130px)'}}>
              <div className="row">
                {this.state.picWall}
              </div>
            </div>
          </div>
        </div>
        <ModalConfirm title="TempEdge Time Track" employee={this.state.employeeName} timeStatus={this.state.timeStatus} reStartfaceDetectTracker={null} ref="faceMashConfirmModal" />
        <ModalFail title="TempEdge Time Track" employee={this.state.employeeName} reStartfaceDetectTracker={null} ref="faceMashFailModal" />
        <PicModal title="Current Snapshot" pic={this.state.currentImage} mountPic={this.mountPic} removePic={this.removePic} reStartfaceDetectTracker={null} ref="picModal" />
      </div>
    );
  }
}

export default withLocalize(connect(null, { push })(FaceMashDesktop));
