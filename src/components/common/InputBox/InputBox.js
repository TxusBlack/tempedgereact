import React from 'react';
import PropTypes from 'prop-types';
import ErrorRender from '../ErrorRender/ErrorRender.js';
import { connect } from 'react-redux';
import { setErrorField, removeErrorField } from '../../../Redux/actions/tempEdgeActions';

let renderInput = (formProps) => {
  let errorClass = `${(formProps.meta.error && formProps.meta.touched)? 'has-error': ''}`;
  let input = null;

  if(formProps.type === "textarea")
    input = <input className="form-control tempEdge-input-box" type="textarea" rows="2" placeholder={formProps.placeholder} {...formProps.input} autoComplete="off" />
  else if(formProps.type === "password"){
      input = <input className="form-control tempEdge-input-box" type="password" rows="2" placeholder={formProps.placeholder} {...formProps.input} autoComplete="off" />
  }else{
    if(formProps.active !== "disabled")
      input = <input className="form-control tempEdge-input-box" type="text" placeholder={formProps.placeholder} {...formProps.input} autoComplete="off" />
    else
      input = <input className="form-control tempEdge-input-box" type="text" placeholder={formProps.placeholder} {...formProps.input} autoComplete="off" disabled />
  }

  if(formProps.meta.form === "NewEmployee"){
    if(formProps.meta.error && formProps.meta.invalid && !formProps.meta.active && formProps.meta.touched){
      let found = formProps.errorFields.indexOf(formProps.input.name);
      if(found === -1){
        formProps.setErrorField(formProps.input.name);
      }
    }else if(typeof formProps.meta.error === 'undefined' && !formProps.meta.invalid && !formProps.meta.active && formProps.meta.touched){
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
