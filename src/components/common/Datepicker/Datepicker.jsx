import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../assets/styles/components/Datepicker.css';
import moment from 'moment';
import ErrorRender from '../ErrorRender/ErrorRender';

const Datepicker = (formProps) => {
  const { input, meta } = formProps;
  const errorClass = `${(meta.error && meta.touched) ? 'has-error' : ''}`;
  return (
    <div className={errorClass}>
      <DatePicker
        onChange={(date) => input.onChange(moment(date).toDate())}
        selected={moment(input.value).isValid() ? new Date(input.value) : null}
        onBlur={input.onBlur}
        className={formProps.customClass}
        showMonthDropdown
        showYearDropdown
        dateFormat="MM/dd/yyyy"
      />
      <ErrorRender {...formProps} />
    </div>
  );
};

export default Datepicker;
