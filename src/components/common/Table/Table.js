import React, { Component } from 'react';
import { push } from 'connected-react-router';
import ActiveLanguageAddTranslation from '../ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import { Translate, withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import THead from './THead.js';
import TBody from './TBody.js';
import Dropdown from '../Dropdown/Dropdown.js';
import Input from '../InputBox/InputBox';
import { date } from 'redux-form-validators';
import DateTime from '../DateTimePicker/DateTimePicker.js';

class Table extends Component {

  constructor(props) {
    super(props);
    this.state = {
      originalData : [],
      data : []
    }
    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
  }
  componentDidUpdate(prevProps, prevState) {
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/employee/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }
  }

  componentDidMount(){
    let columns = this.props.data.columns;
  
    this.setState({
      originalData : this.props.data,
      data : this.props.data.data
    });
    console.log(columns);
  }

  onChange = (col, field) =>{

    let thisData = this.state.originalData.data;
    this.setState({data :  thisData.filter(ob =>ob[col].toString().toLowerCase().includes(field.toString().toLowerCase())) })
  }
  
  render() {
    let columns = this.props.data.columns;
    let content = this.props.data ? this.props.data.data : "";
    

    return (
        <table className="table table-striped sortable">
          {
            columns ? columns.map((col, index) => {
              col.style = (col.hide != null ? "d-none  d-" + col.hide + "-block" : "") ;
              return (
                <th className={
                  index === 0 ? "table-header-left text-center " :
                    index === (columns.length - 1) ? "table-header-right text-center" :
                      "table-header-mid text-center " + (col.hide !== "undefined" && col.hide != null ? "d-none d-"+col.hide+"-table-cell" : "") 
                } style={col.maxFieldSize>0 ? {maxWidth: col.maxFieldSize}:{}}  >{ <Translate id={col.label} />}  <br></br>{
                    col.filterType === 'filter' ? <input ref={col.field} onChange ={()=>this.onChange(col.field, this.refs[col.field].value)}/> :
                      //col.filterType === 'date' ? <Field name={col.field} type="text" category="person" component={DateTime} validate={date()} /> :
                      col.filterType ==='number' ? <input ref={col.field} onChange ={()=>this.onChange(col.field, this.refs[col.field].value)}/> :
                        //col.filterType instanceof Object ? 
                        //<Field name={col.field} data={col.filterType} valueField="id" textField="name" category="agency" component={Dropdown} /> :
                         ""
                  }</th>
  
              )
            }) : "NO COLUMNS"
            
          }
            
          {
            content ? <TBody data = {content.content} columns={columns}/> : "NO RECORDS FOUND"
          }
          
        </table>
    );
  }
}

export default withLocalize(connect(null, { push })(Table));