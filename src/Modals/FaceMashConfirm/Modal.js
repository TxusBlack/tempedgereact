import React from 'react';
import ReactDOM from 'react-dom';

class Modal extends React.Component{
  onClose(modalType){
    if(this.props.reStartfaceDetectTracker !== null){
      this.props.reStartfaceDetectTracker();
    }

    this.props.toggleModal(modalType);   //Close Modal
  }

  render(){
    let ModalComponent = this.props.open? (
      <div onClick={() => this.onClose("success")} className="facemash-modal modal">
        <div onClick={(e) => e.stopPropagation()} className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title text-center">{this.props.title}</h2>
              <button type="button" onClick={() => this.onClose("success")} className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
            <h4 className="text-center">Hi, {this.props.employee}</h4>
            <h4 className="text-center">You have succesfully clocked {this.props.timeStatus}</h4>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary close-btn" data-dismiss="modal" onClick={() => this.onClose("success")}>Close</button>
            </div>
          </div>
        </div>
      </div>
    ): null;

    return ReactDOM.createPortal(
      ModalComponent,
      document.querySelector('#modal')
    );
  }
};

export default Modal;
