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

    switch(props.meta.error){
      case "Password does not match.":
        if(props.input.name === "initialpassword" || props.input.name === "confirmpassword"){
          fieldId = "com.tempedge.error.passwordnomatch";
        }
        break;
      case "Please enter a phone number.":
        fieldId = "com.tempedge.error.phonenumberrequired";
        break;
      case "Name is required.":
        fieldId = "com.tempedge.error.officeNamerequired";
        break;
      case "Address is required.":
        fieldId = "com.tempedge.error.addressrequired";
        break;
      case "City is required.":
        fieldId = "com.tempedge.error.cityrequired";
        break;
      case "Zip code is required.":
        fieldId = "com.tempedge.error.zipcoderequired";
        break;
      case "State is required.":
        fieldId = "com.tempedge.error.staterequired";
        break;
      case "Country is required.":
        fieldId = "com.tempedge.error.countryrequired";
        break;
      default:
    }

    if(props.meta.touched && props.meta.error && typeof props.meta.error !== 'undefined'){
      let error = <p className={className} style={{color: '#a94442'}}><Translate id={fieldId} /></p>;

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
