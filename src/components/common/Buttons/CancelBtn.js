import React, { Component } from 'react';
import {Translate,  withLocalize } from 'react-localize-redux';

class CancelBtn extends Component{

    onCancel = () =>{
        window.location.reload();
    }

    render(){

        return(
        <div >
            <button type="button" className="btn btn-default btn-block register-save-btn previous" 
              onClick={()=>this.onCancel()}>
              <Translate id="com.tempedge.msg.label.cancel"/>
            </button>
        </div>                    
        );
    }
}

export default withLocalize(CancelBtn);
