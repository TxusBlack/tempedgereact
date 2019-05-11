import React from 'react';

class HamburgerButton extends React.Component{
  togglePanelNav = () => {
    this.props.toggleNav();
  }

  render(){
    return(
      <button className="hamburger-btn" onClick={this.togglePanelNav}>
         <div className="hamburger-btn-dash"></div>
         <div className="hamburger-btn-dash"></div>
         <div className="hamburger-btn-dash"></div>
      </button>
    );
  }
}

export default HamburgerButton;
