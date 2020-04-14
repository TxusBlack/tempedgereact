import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../assets/styles/components/Datepicker.css';
import moment from 'moment';
import ErrorRender from '../ErrorRender/ErrorRender';

const Datepicker = (formProps) => {
  const { input, meta, placeholder, customClass } = formProps;
  const errorClass = `${meta.error && meta.touched ? 'has-error' : ''}`;
  return (
    <div className={errorClass}>
      <DatePicker
        onChange={(date) => input.onChange(moment(date).toDate())}
        selected={moment(input.value).isValid() ? new Date(input.value) : null}
        onBlur={input.onBlur}
        className={customClass}
        maxDate={new Date(2050, 11, 31)}
        showMonthDropdown
        showYearDropdown
        dateFormat="MM/dd/yyyy"
        placeholderText={placeholder}
      />
      <ErrorRender {...formProps} />
    </div>
  );
};

export default Datepicker;
