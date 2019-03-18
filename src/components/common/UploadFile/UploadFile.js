import React from 'react';
import ReactDOM from 'react-dom';
import XLSX from 'xlsx';

const $ = window.$;

class UploadFile extends React.Component{
  constructor(props, context) {
    super(props, context);

    this.addTranslationsForActiveLanguage();
  }

  componentDidUpdate(prevProps, prevState) {
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/upload/${this.props.activeLanguage.code}`);
      this.addTranslationsForActiveLanguage();
    }
  }

  addTranslationsForActiveLanguage() {
    const {activeLanguage} = this.props;

    if (!activeLanguage) {
      return;
    }

    import(`../../../translations/${activeLanguage.code}.tempedge.json`)
      .then(translations => {
        this.props.addTranslationForLanguage(translations, activeLanguage.code)
      });
  }

  onChange = () => {
    let input = $(ReactDOM.findDOMNode(this.refs.fileInput));
    let readOnlyTextBox = input.parents('.input-group').find(':text');

    if( readOnlyTextBox.length ) {
      readOnlyTextBox.val(input.val().replace(/\\/g, '/').replace(/.*\//, ''));
    }
  }

  onSubmit = (event) => {
    event.preventDefault();

    let input = $(ReactDOM.findDOMNode(this.refs.fileInput));
    let file  = input.prop('files')[0];

    console.log("file: ", input.prop('files')[0]);

    //AJAX POST CALL to send file to SERVER

  }

  render(){
    return(
      <div className="col-lg-6 col-sm-6 col-12">
        <h4>Upload File</h4>
        <form onSubmit={this.onSubmit}>
          <div className="input-group">
            <label className="input-group-btn">
              <span className="btn btn-primary">
                Browse&hellip; <input type="file" onChange={this.onChange} ref="fileInput" style={{display: "none"}} />
              </span>
            </label>
            <input type="text" className="form-control" readOnly />
          </div><br /><br />
          <button className="btn btn-primary" type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default UploadFile;
