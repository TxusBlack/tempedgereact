import React from 'react';
import ReactDOM from 'react-dom';

class Modal extends React.Component{
  onClose(choice){
    if(this.props.reStartfaceDetectTracker !== null){
      this.props.reStartfaceDetectTracker();
    }

    if(choice === "keep"){
      this.props.mountPic();    //Mount image to wall and add the images collection
    }

    this.props.toggleModal();   //Close Modal
  }

  render(){
    return ReactDOM.createPortal(
      this.props.open? (<div onClick={() => this.onClose()} className="facemash-modal modal">
        <div onClick={(e) => e.stopPropagation()} className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title text-center">{this.props.title}</h2>
              <button type="button" onClick={() => this.onClose()} className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <img src={this.props.pic} style={{width: "100%"}} alt="User Pic" />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary close-btn" data-dismiss="modal" onClick={() => this.onClose("keep")}>Keep</button>
              <button type="button" className="btn btn-primary close-btn" data-dismiss="modal" onClick={() => this.onClose()}>Discard</button>
            </div>
          </div>
        </div>
      </div>): null,
      document.querySelector('#modal')
    );
  }
};

export default Modal;
