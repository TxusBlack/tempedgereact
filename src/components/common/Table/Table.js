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
      data: [],
      pageSize: [20, 50, 100],
    };

    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
  }

  componentDidUpdate(prevProps, prevState) {
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/employee/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }
  }

  onChange = (col, field) => {
    this.props.applyFilter(col, field);
    // this.setState({ data: thisData.filter(ob => ob[col].toString().toLowerCase().includes(field.toString().toLowerCase())) })
  };

  render() {
    const { onClickARow } = this.props;
    const tableClassname = onClickARow ? 'table-hover' : 'table-striped';
    let columns = this.props.data.columns;
    let content = this.props.data ? this.props.data.data : '';

    return (
      <div>
        <div className="row">
          <div className="col-sm-12 col-md-9 col-lg-10"></div>
        </div>

        <table className={`table ${tableClassname}`}>
          {columns
            ? columns.map((col, index) => {
                return (
                  <th
                    className={
                      index === 0
                        ? 'table-header-left text-center '
                        : index === columns.length - 1
                        ? 'table-header-right text-center'
                        : 'table-header-mid text-center ' + (col.hide !== 'undefined' && col.hide != null ? 'd-none d-' + col.hide + '-table-cell' : '')
                    }
                    style={col.maxFieldSize > 0 ? { minWidth: col.maxFieldSize } : {}}>
                    {<Translate id={col.label} />}{' '}
                    {col.selFilterType === 'filter' ? (
                      <React.Fragment>
                        <br></br>
                        <input ref={col.field} onChange={() => this.onChange(col.field, this.refs[col.field].value)} style={col.filterSize > 0 ? { maxWidth: col.filterSize } : {}} />
                      </React.Fragment>
                    ) : //col.selFilterType === 'date' ? <Field name={col.field} type="text" category="person" component={DateTime} validate={date()} /> :
                    col.selFilterType === 'number' ? (
                      <input ref={col.field} onChange={() => this.onChange(col.field, this.refs[col.field].value)} />
                    ) : (
                      //col.selFilterType instanceof Object ?
                      //<Field name={col.field} data={col.selFilterType} valueField="id" textField="name" category="agency" component={Dropdown} /> :
                      ''
                    )}
                  </th>
                );
              })
            : 'NO COLUMNS'}

          {content ? <TBody data={content.content} columns={columns} onClickARow={onClickARow} /> : 'NO RECORDS FOUND'}
        </table>
      </div>
    );
  }
}

export default withLocalize(connect(null, { push })(Table));
