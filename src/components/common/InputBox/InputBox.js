import React from 'react';
import PropTypes from 'prop-types';
import ErrorRender from '../ErrorRender/ErrorRender.js';
import { connect } from 'react-redux';
import { setErrorField, removeErrorField } from '../../../Redux/actions/tempEdgeActions';

let renderInput = (formProps) => {
  let errorClass = `${(formProps.meta.error && formProps.meta.touched)? 'has-error': ''}`;
  let input = null;

  let value = formProps.input.value;
  let phoneNumRegX = new RegExp(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s/0-9]*$/g);
  let timeRegX = new RegExp(/^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/g);

  if(formProps.input.name === 'username'){
    value = formProps.input.value;
  }else if(typeof formProps.input.value !== 'undefined'){
    value = formProps.input.value.toUpperCase();
  }else if(timeRegX.test(value)){
    value = value.toString();
  }else if(!isNaN(value) && value !== ''){
    value = parseInt(value);
  }else if(phoneNumRegX.test(value)){
    value = value.toString();
  }

  if(formProps.type === "textarea")
    input = <textarea className="form-control tempEdge-input-box" rows="4" placeholder={formProps.placeholder} {...formProps.input} value={value} autoComplete="off" />
  else if(formProps.type === "password"){
      input = <input className="form-control tempEdge-input-box" type="password" rows="2" placeholder={formProps.placeholder} {...formProps.input} autoComplete="off" />
  }else{
    if(formProps.active !== "disabled")
      input = <input className="form-control tempEdge-input-box" type="text" placeholder={formProps.placeholder} {...formProps.input} value={value} autoComplete="off" />
    else
      input = <input className="form-control tempEdge-input-box" type="text" placeholder={formProps.placeholder} {...formProps.input} value={value} autoComplete="off" disabled />
  }

  if(formProps.meta.form === "NewEmployee"){
    if(formProps.meta.error && formProps.meta.invalid && !formProps.meta.active && formProps.meta.touched && typeof formProps.errorFields !== 'undefined'){
      let found = formProps.errorFields.indexOf(formProps.input.name);
      if(found === -1){
        formProps.setErrorField(formProps.input.name);
      }
    }else if(typeof formProps.meta.error === 'undefined' && !formProps.meta.invalid && !formProps.meta.active && formProps.meta.touched && typeof formProps.errorFields !== 'undefined'){
      let found = formProps.errorFields.indexOf(formProps.input.name);
      if(found > -1){
        formProps.removeErrorField(formProps.input.name);
      }
    }
  }

  return(
    <div className={errorClass}>
      {input}
      <ErrorRender {...formProps} />
    </div>
  );
}

let InputBox = (props) => {

  return renderInput(props);
}

InputBox.propTypes = {
   setErrorField: PropTypes.func.isRequired,
   removeErrorField: PropTypes.func.isRequired
};

let mapStateToProps = (state) => {
  return({
    errorFields: state.tempEdge.errorFields
  });
};


export default connect(mapStateToProps, { setErrorField, removeErrorField })(InputBox);
