/**
 * How to use <SignaturePad getSignature={this.<myMethod>} />
 * myMethod = (signature) => {}
 */

import React from 'react';
import { push } from 'connected-react-router';
import SignatureCanvas from 'react-signature-canvas';
import { withLocalize } from 'react-localize-redux';
import ActiveLanguageAddTranslation from '../ActiveLanguageAddTranslation/ActiveLanguageAddTranslation';
import '../../../assets/styles/components/SignaturePad.css';

class SignaturePad extends React.Component {
  componentDidUpdate(prevProps) {
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      push(`/user/changePass/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }
  }

  clearCanvas = () => {
    this.sigCanvas.clear();
  };

  getSignature = () => {
    let signature = null;
    if (!this.sigCanvas.isEmpty()) {
      signature = this.sigCanvas.toDataURL();
    }
    this.props.getSignature && this.props.getSignature(signature);
  };

  render() {
    const { translate } = this.props;
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
        <div className="row text-right">
          <div className="col-6">
            <button type="button" onClick={this.clearCanvas} className="btn btn-gray square-right-side">
              {translate('com.tempedge.msg.label.clear')}
            </button>
          </div>
          <div className="col-6">
            <button type="button" onClick={this.getSignature} className="btn btn-blue square-left-side">
              {translate('com.tempedge.msg.label.getsignature')}
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default withLocalize(SignaturePad);
