import React, { Component } from 'react';
import { DateTimePicker } from 'react-widgets';

class TimePicker extends Component {

  constructor(props) {
    super(props)
    this.state = {
      value: null,
    }
  }

  render() {
    return (
      <>
        <DateTimePicker
          value={this.state.value}
          timeFormat="HH:mm:ss"
          onChange={value => this.setState({ value })}
        />
      </>
    )
  }
}

export default TimePicker;