/**
 * How to use <SignaturePad getSignature={this.<myMethod>} />
 * myMethod = (signature) => {}
 */

import React from 'react';
import SignatureCanvas from 'react-signature-canvas';
import '../../../assets/styles/components/SignaturePad.css';

class SignaturePad extends React.Component {
  clearCanvas = () => {
    this.sigCanvas.clear();
  };

  getSignature = () => {
    let signature = null;
    if (!this.sigCanvas.isEmpty()) {
      signature = this.sigCanvas.toDataURL();
    }
    this.props.getSignature(signature);
  };

  render() {
    return (
      <>
        <div className="row">
          <div className="col-12">
            <SignatureCanvas
              penColor="red"
              canvasProps={{ className: 'sigCanvas' }}
              backgroundColor="#f8f9fa"
              ref={(ref) => {
                this.sigCanvas = ref;
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12 text-right">
            <button type="button" onClick={this.clearCanvas} className="btn btn-dark mr-2">
              Clear
            </button>
            <button type="button" onClick={this.getSignature} className="btn btn-info">
              Get signature
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default SignaturePad;
