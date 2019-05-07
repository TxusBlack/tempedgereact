import React from 'react';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';

class Error extends React.Component{
  render(){
    let errorMessage = "";
    let path = window.location.pathname.split("/");
    let pendingEntity = path[2];

    console.log("path: ", path);

    if(this.props.status === "P"){
      errorMessage = `Your application for new ${pendingEntity} creation is pending approval.`;
    }else if(this.props.status === "D"){
      errorMessage = `Your application for new ${pendingEntity} creation was denied.`;
    }else if(this.props.status === "ERROR"){
      errorMessage = "There was an error processing your request.";
    }else{
      errorMessage = "Unauthorized User";
    }

    return <h2>{errorMessage}</h2>;
  }
}

let mapStateToProps = (state) => {
  return{
    status: (state.tempEdge.login !== "")? state.tempEdge.login.portalUserList[0].status: "U"
  };
}

export default withLocalize(connect(mapStateToProps)(Error));
