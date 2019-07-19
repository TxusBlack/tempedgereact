import React from 'react';
import DropdownList from 'react-widgets/lib/DropdownList';
import 'react-widgets/dist/css/react-widgets.css';
import ErrorRender from '../ErrorRender/ErrorRender.js';

let renderDropdownList = (formProps) => {
  let errorClass = `${(formProps.meta.error && formProps.meta.touched)? 'tempEdge-dropdown-input-box has-error-dropdown': 'tempEdge-dropdown-input-box'}`;

  return(
    <div className={errorClass}>
      <DropdownList {...formProps.input} data={formProps.data} valueField={formProps.valueField} textField={formProps.textField} onChange={formProps.input.onChange} />
      <ErrorRender {...formProps} />
    </div>
  );
}

let Dropdown = (props) => {

  return renderDropdownList(props);
}

export default Dropdown;
