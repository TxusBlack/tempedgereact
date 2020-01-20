import React from "react";
import Select from "react-select";

class DropdownList extends React.Component {
  handleChange(value) {
    console.log(value)
    this.props.onClick(this.props.propNameInstate, value[this.props.displayField], value[this.props.id]);
  }

  render() {
   
    const props = this.props;
    const data = props.data || [];
    return (
      <Select
        options={data}
        onChange={value => this.handleChange(value)}
        getOptionLabel={option => `${option[props.displayField]} `}
        getOptionValue={option => `${option[props.id]} `}
        // className={props.customClass}
        clearable
        placeholder="Select"
      />
    );
  }
}

export default DropdownList;

fieldSelected(propNameInState, val, name) {
  this.setState({[propNameInState]: { [name]: val }});
  console.log(this.state)
}

<DropdownList id="id" displayField="name" data={salesmen} propNameInState="salesman" onClick={(propNameInState, val, name) => this.fieldSelected(propNameInState, val, name)}/>