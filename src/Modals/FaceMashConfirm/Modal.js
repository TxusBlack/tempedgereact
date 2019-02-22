import React from 'react';

const $ = window.$;

class Modal extends React.Component{
  constructor(props){
    super(props);
  }

  onClose(){
    this.props.reStartTracking();
  }

  componentDidMount(){
    console.log("FaceMashConfirm Modal Mounted!");
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
              <h4 className="text-center">Hi, {this.props.employee}</h4>
              <h4 className="text-center">You have succesfully clocked {this.props.timeStatus}</h4>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary close-btn" data-dismiss="modal" onClick={() => this.onClose()}>Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Modal;
