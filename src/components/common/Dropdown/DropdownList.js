import React from 'react';
import Select from 'react-select';
import ErrorRender from '../ErrorRender/ErrorRender';
import '../../../assets/styles/Vars.css';

const DropdownList = (formProps) => {
  console.log(formProps);

  const errorClass = `${
    formProps.meta.error && formProps.meta.touched
      ? 'tempEdge-dropdown-input-box has-error-dropdown'
      : 'tempEdge-dropdown-input-box'
  }`;

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: '15px',
      boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0,123,255,.25)' : 'none',
      borderColor: state.isFocused ? '#3eb7e9b3' : '#ced4da',
      fontSize: '14px',
      color: '#6c757d',
      '&:hover': {
        borderColor: 'none',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? 'white' : 'gray',
      background: state.isSelected && 'var(--normal-blue)'
    }),
    menu: (provided) => ({
      ...provided,
    }),
    indicatorSeparator: () => null,
    singleValue: () => ({
      color: '#495057',
      fontFamily: 'Roboto',
      fontSize: '12px',
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: '13px',
    }),
  };

  return (
    <div className={errorClass}>
      <Select
        {...formProps.input}
        options={formProps.data}
        onChange={value => formProps.input.onChange(value)}
        onBlur={() => formProps.input.onBlur(formProps.input.value)}
        // onChange={value => this.handleChange(value)}
        getOptionLabel={option => `${option[formProps.textField]} `}
        getOptionValue={option => `${option[formProps.valueField]} `}
        // className={errorClass}
        clearable
        styles={customStyles}
        placeholder='Select'
      />
      <ErrorRender {...formProps} />
    </div>
  );
};

export default DropdownList;
