import React from "react";
import Webcam from "react-webcam";
import { connect } from 'react-redux';
import { withLocalize } from 'react-localize-redux';
import { push } from 'connected-react-router';
//import Tracker from './assets/tracking';    //Necessary!, DO NOT REMOVE or it will crash
import Modal from '../../Modals/Modal/Modal';
import ActiveLanguageAddTranslation from '../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import httpService from '../../utils/services/httpService/httpService.js';
import { notify } from 'reapop';

let canvas_width = 461;
let canvas_height = 343;

class FaceMashDesktop extends React.Component {
  constructor(props) {
    super(props);

    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage).then(() => {
      this.setState({ error: false })
    }).catch(err => {
      if (!this.state.error) {
        this.setState({ error: true });
        this.fireNotification('Error',
          this.props.activeLanguage.code === 'en'
            ? 'It is not posible to proccess this transaction. Please try again later'
            : 'En este momento no podemos procesar esta transacción. Por favor intente mas tarde.',
          'error'
        );
      }
    });
  }

  state = {
    imgCollection: [],
    currentImage: null,
    picWall: [],
    employeeName: "",
    timeStatus: "",
    trackerTask: null,
    showModal: false,
    error: false
  };

  componentDidMount() {
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');
    //let tracker = new window.tracking.ObjectTracker("face");      //Tracker, canvas and context are needed to turn off the camera on componentUnmount

    this.setState({
      //trackerTask: window.tracking.track('.facemash', tracker, { camera: true })
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/snapshot-desktop/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage).then(() => this.setState({ error: false }));
    }
  }

  componentWillUnmount() {
    //this.state.trackerTask.events_.stopVideoFeed[0]();
  }

  setRef = webcam => {
    this.webcam = webcam;
  }

  //Capture image from webcam and save to component state
  capture = () => {
    let currentImage = this.webcam.getScreenshot();

    //If there's less than 3 images on the list only
    if (this.state.imgCollection.length < 3) {
      this.setState({
        currentImage: currentImage
      }, () => {
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
      <div key={`tile-${picWall.length}`} className="col-md-6 face-tile-container">
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

  //Close Modal
  onClose = (choice) => {
    if (choice === "keep") {
      this.mountPic();    //Mount image to wall and add the images collection
    }

    this.toggleModalOnOff();   //Close Modal
  }


  onSubmit = async (formValues) => {
    let res = await httpService.postImages('/faceRecognition/saveNewSubject', this.state.imgCollection);

    this.fireNotification();
  }

  fireNotification = () => {
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

  fireNotification = (title, message, status) => {
    let { notify } = this.props;

    notify({
      title,
      message,
      status,
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

    let tempEdgeSubmitShow = (this.state.imgCollection.length < 3) ? '' : <button className="btn btn-primary phone-num-btn-submit center-block" onClick={this.onSubmit}>Save</button>;

    let modalContent = <img src={this.state.currentImage} style={{ width: "100%" }} alt="User Pic" />;
    let modalBtns = (
      <React.Fragment>
        <button type="button" className="btn btn-primary close-btn" data-dismiss="modal" onClick={() => this.onClose("keep")}>Keep</button>
        <button type="button" className="btn btn-primary close-btn" data-dismiss="modal" onClick={() => this.onClose()}>Discard</button>
      </React.Fragment>
    );

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-5">
            <div style={{ height: 40 }}></div>
            <div style={{ position: "relative", height: videoConstraints.height }} className="center-block">
              <Webcam className="center-block facemash"
                audio={false}
                height={`${videoConstraints.height}`}
                id="facemash"
                ref={this.setRef}
                screenshotFormat="image/jpeg"
                width="90%"
                videoConstraints={videoConstraints}
              />
              <canvas id="canvas" width="90%" height="359" style={{ position: "absolute", top: 0 }}></canvas>
            </div>
            <button className="btn btn-default phone-num-btn-close center-block" onClick={this.capture} style={{ marginTop: -4 }}>Capture photo</button>
            {tempEdgeSubmitShow}
          </div>
          <div className="col-md-7">
            <div style={{ padding: 40, minHeight: 'calc(100vh - 130px)' }}>
              <div className="row">
                {this.state.picWall}
              </div>
            </div>
          </div>
        </div>
        <Modal title="Current Snapshot" open={this.state.showModal} onClose={this.onClose} content={modalContent} buttons={modalBtns} />
      </div>
    );
  }
}

export default withLocalize(connect(null, { push, notify })(FaceMashDesktop));
