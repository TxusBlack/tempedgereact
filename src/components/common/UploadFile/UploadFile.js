import React from 'react';
import ReactDOM from 'react-dom';
import XLSX from 'xlsx';

const $ = window.$;

class UploadFile extends React.Component{
  constructor(props, context) {
    super(props, context);

    this.addTranslationsForActiveLanguage();
  }

  state ={ workSheet: null };

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

  onChange = (file) => {
    let readOnlyTextBox = $(ReactDOM.findDOMNode(this.refs.fileInputName));

    if( readOnlyTextBox.length )
      readOnlyTextBox.val(file.name.replace(/\\/g, '/').replace(/.*\//, ''));

    let reader = new FileReader();

    reader.readAsBinaryString(file);    //Read Blob as binary

    //Event Listener for when a file is selected to be uploaded
    reader.onload = (event) => { //(on_file_select_event)
      /* Parse data */
      let binaryData = event.target.result;   //'result' if not 'null', contains the contents of the file as a binary string
      let workbook = XLSX.read(binaryData, {type:'binary'});    //Contains all worksheets

      /* Get first worksheet */
      let sheetName = workbook.SheetNames[0];          //Name for first worksheet
      let workSheet = workbook.Sheets[sheetName];      //The actual first worksheet

      let data = XLSX.utils.sheet_to_json(workSheet);  //Convert worksheet to array of JSON objects

      /* Update state */
      this.setState(() => ({
        workSheet: data
      }));
    };
  }

  onSubmit = (event) => {
    event.preventDefault();

    //AJAX POST CALL to send file to SERVER as a Blob
  }

  render(){
    return(
      <div className="col-lg-6 col-sm-6 col-12">
        <h4>Upload File</h4>
        <form onSubmit={this.onSubmit}>
          <div className="input-group">
            <label className="input-group-btn">
              <span className="btn btn-primary">
                Browse&hellip; <input type="file" onChange={(e) => this.onChange(e.target.files[0])}  style={{display: "none"}} />
              </span>
            </label>
            <input type="text" className="form-control" ref="fileInputName" readOnly />
          </div><br /><br />
          <button className="btn btn-primary" type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default UploadFile;
