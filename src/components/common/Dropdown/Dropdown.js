import React from 'react';
import PropTypes from 'prop-types';
import DropdownList from 'react-widgets/lib/DropdownList';
import 'react-widgets/dist/css/react-widgets.css';
import ErrorRender from '../ErrorRender/ErrorRender.js';
import { connect } from 'react-redux';
import { setErrorField, removeErrorField } from '../../../Redux/actions/tempEdgeActions';

let renderDropdownList = (formProps) => {
  let errorClass = `${(formProps.meta.error && formProps.meta.touched)? 'tempEdge-dropdown-input-box has-error-dropdown': 'tempEdge-dropdown-input-box'}`;

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
      <DropdownList {...formProps.input} data={formProps.data} valueField={formProps.valueField} textField={formProps.textField} onChange={formProps.input.onChange} />
      <ErrorRender {...formProps} />
    </div>
  );
}

let Dropdown = (props) => {

  return renderDropdownList(props);
}

Dropdown.propTypes = {
   setErrorField: PropTypes.func.isRequired,
   removeErrorField: PropTypes.func.isRequired
};

let mapStateToProps = (state) => {
  return({
    errorFields: state.tempEdge.errorFields
  });
};


export default connect(mapStateToProps, { setErrorField, removeErrorField })(Dropdown);
