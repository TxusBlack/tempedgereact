import React from 'react';
import Validators from 'redux-form-validators';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import 'react-widgets/dist/css/react-widgets.css';
import ErrorRender from '../ErrorRender/ErrorRender.js';

let renderDateTimePicker = (formProps) => {
  let errorClass = `tempEdge-dateTimePicker-input-box ${(formProps.meta.error && formProps.meta.touched)? 'has-error-dob': ''}`;
  
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

export default _DateTimePicker;
