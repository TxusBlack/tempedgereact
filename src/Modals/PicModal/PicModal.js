import React from 'react';

const $ = window.$;

class Modal extends React.Component{
  constructor(props){
    super(props);
  }

  onClose(choice = "keep"){
    if(this.props.reStartfaceDetectTracker !== null){
      this.props.reStartfaceDetectTracker();
    }

    if(choice === "discard"){
      this.props.removePic();
    }else{
      this.props.mountPic();
    }
  }

  render(){
    return(
      <div className="modal fade" id="openingModal" role="dialog" aria-labelledby="ModalCenterTitle" aria-hidden="false">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title text-center" id="openingModalTitle">{this.props.title}</h2>
              <button type="button" onClick={this.onClose} className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <img src={this.props.pic} style={{width: "100%"}} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary close-btn" data-dismiss="modal" onClick={() => this.onClose()}>Keep</button>
              <button type="button" className="btn btn-primary close-btn" data-dismiss="modal" onClick={() => this.onClose("discard")}>Discard</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Modal;
