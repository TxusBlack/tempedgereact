import React, { Component } from 'react';
import { push } from 'connected-react-router';
import { withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import ActiveLanguageAddTranslation from '../ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';

class TBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btnDisabled: true
    };
    this.tBody = React.createRef();
    const { activeLanguage, addTranslationForLanguage } = this.props;
    ActiveLanguageAddTranslation(activeLanguage, addTranslationForLanguage);
  }

  componentDidUpdate(prevProps) {
    const { activeLanguage, push, addTranslationForLanguage } = this.props;
    const hasActiveLanguageChanged = prevProps.activeLanguage !== activeLanguage;

    if (hasActiveLanguageChanged) {
      push(`/employee/${activeLanguage.code}`);
      ActiveLanguageAddTranslation(activeLanguage, addTranslationForLanguage);
    }
  }

  getSelectedRowsData() {
    const tableData = [];
    const { onClickRows } = this.props;
    if (this.tBody.current) {
      const selectedRows = this.tBody.current.querySelectorAll('tr.table-active');
      selectedRows.forEach((row, index) => {
        tableData.push([]);
        row.querySelectorAll('td').forEach((td) => {
          tableData[index].push(td.textContent);
        });
      });
      onClickRows(tableData);
    }
  }

  selectRows(e) {
    const { multipleRows, onClickRows } = this.props;
    if (onClickRows) {
      const { currentTarget } = e;
      const { parentNode } = currentTarget;

      currentTarget.classList.toggle('table-active');
      const selectedRows = parentNode.querySelectorAll('tr.table-active');

      if (multipleRows) {
        let btnDisabled = true;
        if (selectedRows.length > 0) {
          btnDisabled = false;
        }
        this.setState({
          btnDisabled
        });
      } else {
        this.getSelectedRowsData();
      }
    }
  }

  renderButton() {
    const { multipleRows } = this.props;
    if (multipleRows) {
      return (
        <button type="button" onClick={() => this.getSelectedRowsData()} className="btn btn-primary btn-block" disabled={this.state.btnDisabled}>
          Add
        </button>
      );
    }
    return '';
  }

  render() {
    const { data, columns } = this.props;
    return (
      <>
        <tbody ref={this.tBody}>
          {data && data.length > 0 ? (
            data.map((row) => {
              return (
                <tr className="tableRow" onClick={(e) => this.selectRows(e)}>
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
              <br />
              NO RECORDS FOUND!
            </p>
          )}
        </tbody>
        {this.renderButton()}
      </>
    );
  }
}

export default withLocalize(connect(null, { push })(TBody));
