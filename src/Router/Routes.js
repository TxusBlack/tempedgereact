import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Favicon from 'react-favicon';
import App from '../components/App';
import NavBar from '../components/NavBar/NavBar';
import Footer from '../components/Footer/Footer';
import Login from '../components/Login/Login';
import CreateNewUser from '../components/Login/CreateNewUser';

let Routes = () => {
  return(
        <React.Fragment>
          <Favicon url="/img/favicon.ico" />
          <NavBar />
          <Router>
              <Switch>
                <Route exact path="/" component={App} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={CreateNewUser} />
              </Switch>
          </Router>
          <Footer />
        </React.Fragment>
    );
 }

 export default Routes;
