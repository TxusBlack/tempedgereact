import React, { Component } from 'react';
import { push } from 'connected-react-router';
import ActiveLanguageAddTranslation from '../ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import { Translate, withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import Dropdown from '../Dropdown/Dropdown.js';
import Input from '../InputBox/InputBox';
import { date } from 'redux-form-validators';
import DateTime from '../DateTimePicker/DateTimePicker.js';

class THead extends Component {

  constructor(props) {
    super(props);

    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
  }
  componentDidUpdate(prevProps, prevState) {
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/approveuser/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }
  }
  componentDidMount() {
    let col = this.props.columns;
    console.log(col);
  }

  render() {
    let columns = this.props.columns;
    return (
      <thead >
        {
          columns ? columns.map((col, index) => {
            col.style = "d-none  d-" + col.hide + "-block";
            return (
              <th className={
                index === 0 ? "table-header-left text-center " :
                  index === (columns.length - 1) ? "table-header-right text-center" :
                    "table-header-mid text-center d-none d-" + col.hide + "-table-cell"
              }>{col.label}  <br></br>{
                  col.filterType === 'filter' ? <input ref={col.field} onChange={() => this.onChange(col.field, this.refs[col.field].value)} /> :
                    col.filterType === 'date' ? <Field name={col.field} type="text" category="person" component={DateTime} validate={date()} /> :
                      col.filterType === 'number' ? <input ref={col.field} onChange={() => this.onChange(col.field, this.refs[col.field].value)} /> :
                        col.filterType instanceof Object ?
                          <Field name={col.field} data={col.filterType} valueField="id" textField="name" category="agency" component={Dropdown} />
                          : ""
                }</th>

            )
          }) : "NO COLUMNS"
        }
      </thead>
    );
  }
}

THead = reduxForm({
  form: 'table', //                 <------ form name
  destroyOnUnmount: false, //        <------ preserve form data
  // forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  //validate: Validate
})(THead);


export default withLocalize(connect(null, { push })(THead));