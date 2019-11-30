import React, { Component } from 'react';
import {Translate,  withLocalize } from 'react-localize-redux';

class SubmitBtn extends Component{
    render(){
        return(
        <div >
            <button type="submit" className="btn btn-primary btn-block register-save-btn " 
              disabled={this.props.invalid || this.props.pristine} 
              onClick={this.props.onClick}>
              <Translate id="com.tempedge.msg.label.submit"/>
            </button>
        </div>                    
        );
    }
}

export default withLocalize(SubmitBtn);
