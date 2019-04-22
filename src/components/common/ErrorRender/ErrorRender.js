import React from 'react';
import { Translate } from 'react-localize-redux';

let renderError = (props) => {
  let fieldId='';
  let className = '';

  if(typeof props.input !== 'undefined'){
    fieldId = `com.tempedge.error.${props.category}.${props.input.name}required`;

    if(fieldId === "com.tempedge.error.person.usernamerequired" || fieldId === "com.tempedge.error.person.passwordrequired"){
      className = "text-left";
    }

    if(props.meta.touched && props.meta.error && typeof props.meta.error !== 'undefined'){
      let error = <p className={className} style={{color: '#a94442'}}><Translate id={fieldId}></Translate></p>;

      return error;
    }
  }
}

let RenderError = (props) => {
  let errorMsg = renderError(props);

  return(
    <React.Fragment>
      {errorMsg}
    </React.Fragment>
  );
}

export default RenderError;
