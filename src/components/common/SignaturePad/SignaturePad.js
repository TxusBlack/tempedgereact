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
        <div className="row">
          <div className="col-12 text-right">
            <button type="button" onClick={this.clearCanvas} className="btn btn-default mr-2">
              {translate('com.tempedge.msg.label.getsignature')}
            </button>
            <button type="button" onClick={this.getSignature} className="btn btn-info">
              {translate('com.tempedge.msg.label.clear')}
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default withLocalize(SignaturePad);
