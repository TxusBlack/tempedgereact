import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';

class Footer extends Component{
  render(){
    return(
      <div className="footer text-left" style={{color: this.props.textColor, backgroundColor: this.props.background, padding: "0 2.5rem"}}>
        {this.props.content}
      </div>
    );
  }
}

export default withLocalize(Footer);
