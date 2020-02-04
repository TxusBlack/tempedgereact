import React from 'react';
import PropTypes from 'prop-types';
import Validators from 'redux-form-validators';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import 'react-widgets/dist/css/react-widgets.css';
import ErrorRender from '../ErrorRender/ErrorRender.js';
import { connect } from 'react-redux';
import { setErrorField, removeErrorField } from '../../../Redux/actions/tempEdgeActions';

let renderDateTimePicker = (formProps) => {
  let errorClass = `tempEdge-dateTimePicker-input-box ${(formProps.meta.error && formProps.meta.touched)? 'has-error-dob': ''}`;

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
      <DateTimePicker onChange={formProps.input.onChange} onBlur={formProps.input.onBlur} format="MM/DD/YYYY" time={formProps.showTime} value={!formProps.input.value ? null : new Date(formProps.input.value)} />
      <ErrorRender {...formProps} />
    </div>
  );
}

let _DateTimePicker = (props) => {
  Object.assign(Validators.defaultOptions, {
    dateFormat: 'mm/dd/yyyy'
  });

  Object.assign(Validators.messages, {
    dateFormat: {
      id: "form.errors.dateFormat",
      defaultMessage: "Date field is required"
    }
  });

  return renderDateTimePicker(props);
}

_DateTimePicker.propTypes = {
   setErrorField: PropTypes.func.isRequired,
   removeErrorField: PropTypes.func.isRequired
};

let mapStateToProps = (state) => {
  return({
    errorFields: state.tempEdge.errorFields
  });
};


export default connect(mapStateToProps, { setErrorField, removeErrorField })(_DateTimePicker);
