import React, { Component } from 'react';
import { push } from 'connected-react-router';
import ActiveLanguageAddTranslation from '../ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import { Translate, withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import TBody from './TBody.js';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

class Table extends Component {

  constructor(props) {
    super(props);
    this.state = {
      originalData: [],
      data: [],
      pageSize: [20, 50, 100],
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

  componentDidMount() {
    let columns = this.props.data.columns;

    this.setState({
      originalData: this.props.data,
      data: this.props.data.data
    });
  }

  onChange = (col, field) => {

    let thisData = this.state.originalData.data;
    this.setState({ data: thisData.filter(ob => ob[col].toString().toLowerCase().includes(field.toString().toLowerCase())) })
  }

  render() {
    let columns = this.props.data.columns;
    let content = this.props.data ? this.props.data.data : "";


    return (
      <div>
        <div className='row'>
          <div className='col-sm-12 col-md-9 col-lg-10'>

          </div>
          <div className='col-sm-12 col-md-3 col-lg-2'>
            <DropdownButton id="dropdown-basic-button" style={{backgroundColor : 'red'}} title='Change list size'>
              <Dropdown.Item href="#/action-1">30</Dropdown.Item>
              <Dropdown.Item href="#/action-2">50</Dropdown.Item>
              <Dropdown.Item href="#/action-3">100</Dropdown.Item>
            </DropdownButton>
          </div>
        </div>



        <table className="table table-striped ">
          {
            columns ? columns.map((col, index) => {
              return (
                <th className={
                  index === 0 ? "table-header-left text-center " :
                    index === (columns.length - 1) ? "table-header-right text-center" :
                      "table-header-mid text-center " + (col.hide !== "undefined" && col.hide != null ? "d-none d-" + col.hide + "-table-cell" : "")
                } style={col.maxFieldSize > 0 ? { minWidth: col.maxFieldSize } : {}}  >{<Translate id={col.label} />}  {
                    col.filterType === 'filter' ? <input ref={col.field} onChange={() => this.onChange(col.field, this.refs[col.field].value)} /> :
                      //col.filterType === 'date' ? <Field name={col.field} type="text" category="person" component={DateTime} validate={date()} /> :
                      col.filterType === 'number' ? <input ref={col.field} onChange={() => this.onChange(col.field, this.refs[col.field].value)} /> :
                        //col.filterType instanceof Object ? 
                        //<Field name={col.field} data={col.filterType} valueField="id" textField="name" category="agency" component={Dropdown} /> :
                        ""
                  }</th>
              )
            }) : "NO COLUMNS"

          }

          {
            content ? <TBody data={content.content} columns={columns} /> : "NO RECORDS FOUND"
          }

        </table>
      </div>

    );
  }
}


export default withLocalize(connect(null, { push })(Table));