import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import store from './store/store';
import { Provider } from "react-redux";
import { LocalizeProvider } from 'react-localize-redux';
import { renderToStaticMarkup } from 'react-dom/server';
import Favicon from 'react-favicon';
import NavBar from './components/common/NavBar/NavBar';
import Footer from './components/common/Footer/Footer';
import HomePage from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import CreateNewUser from './Pages/Login/CreateNewUser';
import CreateNewAgency from './Pages/Login/CreateNewAgency';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword';

let App = () => {
  let defaultLanguage = 'en';
  let languages = [
    { name: 'English', code: 'en' },
    { name: 'Spanish', code: 'es' }
  ];
  let options = { renderToStaticMarkup };

  return(
    <Provider store={store}>
      <LocalizeProvider store={store}>
        <Favicon url="/img/favicon.ico" />
        <Router>
          <React.Fragment>
            <NavBar />
            <Switch>
              <Route exact path="/" component={ () => <HomePage lang={defaultLanguage} languages={languages} options={options} /> } />
              <Route exact path="/login/:lang" render={ (props) => <Login languages={languages} options={options}  params={props.match.params} {...props} /> } />
              <Route exact path="/register/:lang" render={ (props) => <CreateNewUser languages={languages} options={options} params={props.match.params} {...props} /> } />
              <Route exact path="/registerAgency/:lang" render={ (props) => <CreateNewAgency languages={languages} options={options} params={props.match.params} {...props} /> } />
              <Route exact path="/resetpassword/:lang" render={ (props) => <ForgotPassword languages={languages} options={options} params={props.match.params} {...props} /> } />
            </Switch>
          </React.Fragment>
        </Router>
        <Footer />
      </LocalizeProvider>
    </Provider>
    );
 }

 export default App;
