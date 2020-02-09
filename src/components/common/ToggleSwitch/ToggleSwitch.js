import React from 'react';
import '../../../assets/styles/components/ToggleSwitch.css';

class ToggleSwitch extends React.Component {
  componentDidMount() {
    if (this.props.checked) {
      this.refs.input.checked = true;
    } else {
      this.refs.input.checked = false;
    }
  }

  render() {
    return (
      <div className='toggle-switch'>
        <input onChange={e => this.props.input.onChange(e.target.checked)} type='checkbox' className='toggle-switch__checkbox' ref='input' />
        <div className='toggle-switch__knobs'></div>
        <div className='toggle-switch__layer'></div>
      </div>
    );
  }
}

export default ToggleSwitch;
