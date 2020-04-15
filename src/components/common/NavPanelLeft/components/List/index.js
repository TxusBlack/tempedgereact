import React from 'react';
import { Link } from 'react-router-dom';
import history from '../../../../../history.js';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import helpers from '../../../../../utils/helpers';
import { withLocalize, Translate } from 'react-localize-redux';
import ActiveLanguageAddTranslation from '../../../ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      parentBackground: false,
      subMenu: []
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/dashboard/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }
  }

  displaySubMenu = (e, index) => {
    e.target.closest('li').classList.toggle('menu-option-selected');
    let subMenu = this.state.subMenu;
    subMenu[index] = !subMenu[index];
    this.setState(() => ({
      subMenu: subMenu
    }));
  };

  onClickRedirect = (url, index) => {
    this.props.onClick();
    history.push(url);
  };

  render() {
    let { onClick, activeLanguage, list, translate } = this.props;
    let parents = [];
    let children = [];
    let lista = Array.isArray(list) && list.length > 0 ? list : [];

    lista.map((item, index) => {
      if (item.parent === null) {
        parents.push({
          category: item.optionName,
          optionPath: item.optionPath,
          children: [],
          menuOrder: item.menuOrder
        });
      } else {
        children.push(item);
      }
    });

    children.map((item, index) => {
      let idx = helpers.findByProp(parents, item.parent, 'category');

      if (idx < 0) {
        parents.push({
          category: item.parent,
          optionPath: '',
          children: [],
          menuOrder: item.menuOrder
        });
      }
    });

    parents.sort((a, b) => (a.menuOrder > b.menuOrder ? 1 : -1));
    children.sort((a, b) => (a.menuOrder > b.menuOrder ? 1 : -1));

    parents.map((parent, x) => {
      children.map((child, y) => {
        if (parent.category === child.parent) {
          parent.children.push(child);
        }
      });
    });

    let menu = [];

    parents.map((item, index) => {
      if (item.children.length < 1) {
        menu.push(
          <Link onClick={onClick} to={`${item.optionPath}/${activeLanguage} `} style={{ marginLeft: 0, cursor: 'pointer' }}>
            <li>
              <span>{translate(item.category)}</span>
            </li>
          </Link>
        );
      } else {
        menu.push(
          <>
            <Link onClick={(e) => this.displaySubMenu(e, item.category)} style={{ cursor: 'pointer' }} to="#">
              <li className="d-flex justify-content-between">
                {translate(item.category)}
                <span className="down-arrow">﹀</span>
              </li>
            </Link>
            {this.state.subMenu[item.category] ? (
              <ul className="sub-menu">
                {item.children.map((child, j) => {
                  return (
                    <li onClick={() => this.onClickRedirect(`${child.optionPath}/${activeLanguage} `, child.parent)} style={{ cursor: 'pointer' }}>
                      <span>{translate(child.optionName)}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              ''
            )}
          </>
        );
      }
    });

    return (
      <ul className="main-menu" style={{}}>
        {menu}
      </ul>
    );
  }
}
export default withLocalize(connect(null, { push })(List));
