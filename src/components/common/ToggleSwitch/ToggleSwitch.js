import React from 'react';
import '../../../assets/styles/components/ToggleSwitch.css';

const ToggleSwitch = formProps => {
  const { checked } = formProps;
  return (
    <div className='toggle-switch'>
      <input onChange={e => formProps.input.onChange(e.target.checked)} type='checkbox' className='toggle-switch__checkbox' checked={checked} />
      <div className='toggle-switch__knobs'></div>
      <div className='toggle-switch__layer'></div>
    </div>
  );
};

export default ToggleSwitch;
