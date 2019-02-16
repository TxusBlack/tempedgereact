import React, { Component } from 'react';
import { withLocalize, Translate } from 'react-localize-redux';

class Footer extends Component{
  render(){
    return(
      <div className="footer text-right">
        <p> © 2019 - TempEdge LLC. 101 N Feltus St. South Amboy NJ. 08879. <Translate id="com.tempedge.msg.label.rights">All rights reserved.</Translate> </p>
      </div>
    );
  }
}

export default withLocalize(Footer);
