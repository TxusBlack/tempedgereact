import React from "react";
import "../../../assets/styles/components/ToggleSwitch.css";

class ToggleSwitch extends React.Component {
  handleChange(e) {
    //this.props.onClick(e.target.checked);
  }

  render() {
    return (
      <div className="toggle-switch">
        <input
          onChange={e => this.handleChange(e)}
          type="checkbox"
          className="toggle-switch__checkbox"
        />
        <div className="toggle-switch__knobs"></div>
        <div className="toggle-switch__layer"></div>
      </div>
    );
  }
}

export default ToggleSwitch;
