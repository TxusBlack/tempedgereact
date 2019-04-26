import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

let PrivateRoute = (props) => {
  let { component: Component, ...rest } = props;
  let PrivateRouteComponent = <Component {...props} />;
  let RedirectComponent = <Redirect to={{ pathname: props.redirectPath, state: { from: props.location }}} />;

  return (
    <Route render={() => (props.status === 'A') ? PrivateRouteComponent : RedirectComponent} {...rest} />
  );
}

let mapStateToProps = (state) => {
  return{
    status: (state.tempEdge.login !== "")? state.tempEdge.login.portalUserList[0].status: null
  };
}

export default connect(mapStateToProps)(PrivateRoute);
