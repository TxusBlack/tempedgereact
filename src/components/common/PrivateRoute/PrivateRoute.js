import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import Dashboard from '../../../Pages/Dashboard/Dashboard.js';
import AgencyList from '../../../Pages/Agencies/AgencySelect/AgencySelectList';

let PrivateRoute = (props) => {
  let { ...rest } = props;
  let RouteComponent = <Dashboard title="User Dashboard" body={<p>This is the User's dashboard.</p>}/>;   //UserDashboard component, default
  let RedirectComponent = <Redirect to={{ pathname: props.redirectPath, state: { from: props.location }}} />;   //Back to Login if ERROR

  //Conditional rendering based on user role
  if(props.userRoleId === 1){     //If user role is Admin
    RouteComponent = <Dashboard title="Admin Dashboard" body={<p>This is the Admin's dashboard.</p>} />
  }else if(props.portalUserList.length > 1){
    RouteComponent = <AgencyList agencies={props.portalUserList} />
  }

  return (
    <Route render={() => (props.UserStatus === 'A') ? RouteComponent : RedirectComponent} {...rest} />
  );
}

let mapStateToProps = (state) => {
  return{
    UserStatus: (state.tempEdge.login !== "")? state.tempEdge.login.portalUserList[0].status: null,
    AgencyStatus: (state.tempEdge.login !== "")? state.tempEdge.login.portalUserList[0].organizationEntity.status: null,
    userRoleId: (state.tempEdge.login !== "")? state.tempEdge.login.portalUserList[0].userRoleId: null,
    portalUserList: (state.tempEdge.login !== "" && state.tempEdge.login.portalUserList.length > 1)? state.tempEdge.login.portalUserList: []
  };
}

export default connect(mapStateToProps)(PrivateRoute);
