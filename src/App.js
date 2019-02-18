import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import store from './store/store';
import { Provider } from "react-redux";
import { LocalizeProvider } from 'react-localize-redux';
import { renderToStaticMarkup } from 'react-dom/server';
import { initialize } from 'react-localize-redux';
import { withLocalize } from 'react-localize-redux';
import Favicon from 'react-favicon';
import NavBar from './components/common/NavBar/NavBar';
import Footer from './components/common/Footer/Footer';
import HomePage from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import CreateNewUser from './Pages/Login/CreateNewUser';
import CreateNewAgency from './Pages/Login/CreateNewAgency';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword';

class App extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    let defaultLanguage = 'en';

    let languages = [
      { name: 'English', code: 'en' },
      { name: 'Spanish', code: 'es' }
    ];

    let options = {
      defaultLanguage: "en",
      renderToStaticMarkup: renderToStaticMarkup
    };

    return(
      <Provider store={store}>
        <LocalizeProvider store={store} initialize={{ languages: languages, options: options }}>
          <Favicon url="/img/favicon.ico" />
          <Router>
            <React.Fragment>
              <NavBar />
              <Switch>
                <Route exact path="/" component={ () => <HomePage lang={defaultLanguage} /> } />
                <Route exact path="/auth/:lang" render={ (props) => <Login params={props.match.params} {...props} /> } />
                <Route exact path="/register/:lang" render={ (props) => <CreateNewUser params={props.match.params} {...props} /> } />
                <Route exact path="/registerAgency/:lang" render={ (props) => <CreateNewAgency params={props.match.params} {...props} /> } />
                <Route exact path="/resetpassword/:lang" render={ (props) => <ForgotPassword params={props.match.params} {...props} /> } />
              </Switch>
            </React.Fragment>
          </Router>
          <Footer />
        </LocalizeProvider>
      </Provider>
      );
  }
 }

 export default withLocalize(App);
