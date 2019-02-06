import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Favicon from 'react-favicon';
import NavBar from './components/common/NavBar/NavBar';
import Footer from './components/common/Footer/Footer';
import HomePage from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import CreateNewUser from './Pages/Login/CreateNewUser';

let App = () => {
  return(
        <React.Fragment>
          <Favicon url="/img/favicon.ico" />
          <NavBar />
          <Router>
              <Switch>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={CreateNewUser} />
              </Switch>
          </Router>
          <Footer />
        </React.Fragment>
    );
 }

 export default App;
