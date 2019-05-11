import React from "react";
import ReactDOM from 'react-dom';
import Webcam from "react-webcam";
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import Tracker from './assets/tracking';
import ModalConfirm from '../../Modals/FaceMashConfirm/Modal';
import ModalFail from '../../Modals/FaceMashFail/Modal';
import PicModal from '../../Modals/PicModal/Modal';
import ActiveLanguageAddTranslation from '../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import httpService from '../../utils/services/httpService/httpService.js';
import { notify } from 'reapop';
import JSOG from 'jsog';

let canvas_width = 461;
let canvas_height: 343;

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
    trackerTask: null,
    showModal: false
  };

  componentDidMount(){
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');
    let tracker = new window.tracking.ObjectTracker("face");      //Tracker, canvas and context are needed to turn off the camera on componentUnmount

    this.setState({
      trackerTask: window.tracking.track('.facemash', tracker, { camera: true })
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
  }

  //Capture image from webcam and save to component state
  capture = () => {
    let currentImage = this.webcam.getScreenshot();

    //If there's less than 3 images on the list only
    if(this.state.imgCollection.length < 3){
      this.setState({
        currentImage: currentImage
      },() => {
        this.toggleModalOnOff();    //Open Modal
      });
    }
  }

  //Adds currentImage to collection of images in the component state
  addImagetoCollection = () => {
    let imageSrc = this.state.imgCollection;
    imageSrc.push(this.state.currentImage);

    this.setState({
      imgCollection: imageSrc
    });
  }

  //Set Modal visible or not
  toggleModalOnOff = () => {
    this.setState({
      showModal: !this.state.showModal
    });
  }

  //Mount current image to wall and increase images collection by one
  mountPic = () => {
    let picWall = this.state.picWall;   //Wall with all images
    this.addImagetoCollection();        //Add currentImage to collection of images in the component state

    //New Tile containing currentImage
    let picElement = (
      <div key={`tile-${picWall.length}`} className="col-lg-6 face-tile-container">
        <div className="face-tile">
          <img src={this.state.currentImage} alt="Face Tile" />
        </div>
      </div>
    );

    //Add New Tile to wall
    picWall.push(picElement);
    this.setState({
      picWall: picWall
    });
  }

  onSubmit = async (formValues) => {
    let res = await httpService.postImages('/faceRecognition/saveNewSubject', this.state.imgCollection);
    //let res = await httpService.postImage('/faceRecognition/recognizeFace', this.state.currentImage);

    console.log('response: ', res);

    this.fireNotification();
  }

  fireNotification = () => {
    console.log("NOTIFY RAN!");
    let { notify } = this.props;

    notify({
      title: 'Images Submitted',
      message: 'Your images have been successfully saved to our records.',
      status: 'success',
      position: 'br',
      dismissible: true,
      dismissAfter: 3000
    });
  }

  render() {
    let videoConstraints = {
      width: canvas_width,
      height: canvas_height,
      facingMode: "user"
    };

    let tempEdgeSubmitShow = (this.state.imgCollection.length < 3)? '': <button className="btn btn-primary phone-num-btn-submit center-block" onClick={this.onSubmit}>Save</button>;

    return(
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-5">
            <div style={{height:40}}></div>
            <div style={{position: "relative", height: videoConstraints.height}} className="video-capture-container">
              <Webcam className="mx-auto facemash"
                audio={false}
                height={`${videoConstraints.height}`}
                id="facemash"
                ref={this.setRef}
                screenshotFormat="image/jpeg"
                width="90%"
                videoConstraints={videoConstraints}
              />
              <canvas id="canvas" width="90%" height="359" style={{position: "absolute", top: 0, left: 0}}></canvas>
            </div>
            <div className="video-capture-container">
              <button className="btn btn-default phone-num-btn-close" onClick={this.capture}>Capture photo</button>
            </div>
            <div className="video-capture-container">
              {tempEdgeSubmitShow}
            </div>
          </div>
          <div className="col-lg-7">
            <div style={{padding:40, minHeight:'calc(100vh - 130px)'}}>
              <div className="row">
                {this.state.picWall}
              </div>
            </div>
          </div>
        </div>
        <PicModal title="Current Snapshot" open={this.state.showModal} toggleModal={this.toggleModalOnOff} pic={this.state.currentImage} mountPic={this.mountPic} reStartfaceDetectTracker={null} />
      </div>
    );
  }
}

export default withLocalize(connect(null, { push, notify })(FaceMashDesktop));
