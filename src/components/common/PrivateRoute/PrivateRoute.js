import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import UserDashboard from '../../../Pages/UserDashboard/UserDashboard.js';
import AdminDashboard from '../../../Pages/AdminDashboard/AdminDashboard.js';
import EmployeeList from '../../../Pages/Employee/EmployeeList';

let PrivateRoute = (props) => {
  let { ...rest } = props;
  let RouteComponent = <UserDashboard />;   //UserDashboard component, default
  let RedirectComponent = <Redirect to={{ pathname: props.redirectPath, state: { from: props.location }}} />;   //Back to Login if ERROR

  //Conditional rendering based on user role
  if(props.userRoleId === 1){     //If user role is Admin
    RouteComponent = <AdminDashboard />
  }

  return (
    <Route render={() => (props.UserStatus === 'A') ? RouteComponent : RedirectComponent} {...rest} />
  );
}

let mapStateToProps = (state) => {
  return{
    UserStatus: (state.tempEdge.login !== "")? state.tempEdge.login.portalUserList[0].status: null,
    AgencyStatus: (state.tempEdge.login !== "")? state.tempEdge.login.portalUserList[0].organizationEntity.status: null,
    userRoleId: (state.tempEdge.login !== "")? state.tempEdge.login.portalUserList[0].userRoleId: null
  };
}

export default connect(mapStateToProps)(PrivateRoute);
