import React from 'react';
import { connect } from 'react-redux';
import { withLocalize } from 'react-localize-redux';

class Error extends React.Component{
  render(){
    let errorMessage = "";
    let path = window.location.pathname.split("/");
    let pendingEntity = path[2];

    if(this.props.status === "P"){
      errorMessage = `Your application for new ${pendingEntity} creation is pending approval.`;
    }else if(this.props.status === "D"){
      errorMessage = `Your application for new ${pendingEntity} creation was denied.`;
    }else if(this.props.status === "ERROR"){
      errorMessage = "There was an error processing your request.";
    }else if(this.props.status === "U"){
      errorMessage = "Sorry we cannot not process your transaction, try again later."
    }else{
      errorMessage = "Unauthorized User.";
    }

    return <h2>{errorMessage}</h2>;
  }
}

let mapStateToProps = (state) => {
  console.log("state.tempEdge.login: ", state.tempEdge.login);
  return{
    status: (state.tempEdge.login !== "" && state.tempEdge.login.portalUserList.length > 0)? state.tempEdge.login.portalUserList[0].status: "U"
  };
}

export default withLocalize(connect(mapStateToProps)(Error));
