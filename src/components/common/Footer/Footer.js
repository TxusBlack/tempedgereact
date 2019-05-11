import React, { Component } from 'react';
import { withLocalize, Translate } from 'react-localize-redux';

class Footer extends Component{
  render(){
    return(
      <div className="footer text-left" style={{ paddingLeft: "2.5rem", backgroundColor: `${this.props.backgroundColor}`}}>
        {this.props.content}
      </div>
    );
  }
}

export default withLocalize(Footer);
