import React from 'react';
import ReactDOM from 'react-dom';

class ModalSimple extends React.Component{
  render(){
    let ModalComponent = this.props.open? (
      <div onClick={() => this.props.onClose()} className="facemash-modal modal">
        <div onClick={(e) => e.stopPropagation()} className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title text-center">{this.props.title}</h2>
              <button type="button" onClick={() => this.props.onClose()} className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {this.props.content}
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

export default ModalSimple;
