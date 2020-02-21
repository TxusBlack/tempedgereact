import React, { Component } from 'react';
import { push } from 'connected-react-router';
import ActiveLanguageAddTranslation from '../ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import { Translate, withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

class TBody extends Component {
  constructor(props) {
    super(props);

    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
  }

  componentDidUpdate(prevProps, prevState) {
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/employee/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }
  }

  render() {
    let data = this.props.data;
    let columns = this.props.columns;

    return (
      <tbody>
        {data && data.length > 0 ? (
          data.map((row) => {
            return (
              <tr className="tableRow" onClick={this.props.onClickARow}>
                {columns
                  ? columns.map((col, index) => {
                      return (
                        <td
                          className={
                            index === 0
                              ? 'table-content '
                              : index === columns.length - 1
                              ? 'table-content'
                              : 'table-content ' + (col.hide !== 'undefined' && col.hide != null ? ' d-none d-' + col.hide + '-table-cell' : '')
                          }
                          style={col.maxFieldSize > 0 ? { maxWidth: col.maxFieldSize } : {}}>
                          {row[col.field]}{' '}
                        </td>
                      );
                    })
                  : 'NO RECORDS FOUND!'}
              </tr>
            );
          })
        ) : (
          <p>
            <br></br>NO RECORDS FOUND!
          </p>
        )}
      </tbody>
    );
  }
}

export default withLocalize(connect(null, { push })(TBody));
