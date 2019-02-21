import React from "react";
import Webcam from "react-webcam";
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import  { setActivePage } from '../../Redux/actions/tempEdgeActions';

class FaceMash extends React.Component {
  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => {
    let imageSrc = this.webcam.getScreenshot();
  };

  render() {
    let videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "user"
    };

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8 col-md-offset-2">
            <Webcam className="center-block"
              audio={false}
              height={320}
              ref={this.setRef}
              screenshotFormat="image/jpeg"
              width={320}
              videoConstraints={videoConstraints}
            />
            <button className="btn btn-default phone-num-btn-close center-block" onClick={this.capture}>Capture photo</button>
          </div>
        </div>
      </div>
    );
  }
}

export default withLocalize(connect(null)(FaceMash));
