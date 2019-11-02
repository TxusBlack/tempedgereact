import React from "react";
import { Redirect, Route } from 'react-router-dom';
import { withLocalize } from 'react-localize-redux';

let PrivateRoute = ( props, { component: Component, ...rest} ) => {
  let token = sessionStorage.getItem('access_token');

  return (typeof token === 'undefined' || token === null)? <Redirect to={`/auth/${props.activeLanguage.code}`} />: <Route exact path={props.path} component={props.component} />;
};

export default withLocalize((PrivateRoute));
