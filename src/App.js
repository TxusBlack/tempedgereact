import React from 'react';
import 'babel-polyfill';
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router'
import { store, persistor, history } from './store/store';
import { Provider } from "react-redux";
import { LocalizeProvider } from 'react-localize-redux';
import { renderToStaticMarkup } from 'react-dom/server';
import { withLocalize, Translate } from 'react-localize-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import Favicon from 'react-favicon';
import NavBar from './components/common/NavBar/NavBar';
import NavPanelLeft from './components/common/NavPanelLeft/NavPanelLeft.js';
import BackgroundFade from './components/common/NavPanelLeft/BackgroundFade.js';
import Footer from './components/common/Footer/Footer';
import HomePage from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import CreateNewUser from './Pages/Login/CreateNewUser/CreateNewUser';
import CreateNewAgency from './Pages/Login/CreateNewAgency/CreateNewAgency';
import CreateNewClient from './Pages/Client/CreateNewClient/CreateNewClient';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword';
import FaceMashDesktop from './Pages/FaceMash/FaceMashDesktop';
import LoadingView from './components/common/LoadingSplashScreen/LoadingSplashScreen';
import Notifications from './components/common/Notifications/Notifications';
import UploadFile from './components/common/UploadFile/UploadFile';
import PrivateRoute from './components/common/PrivateRoute/PrivateRoute';
import Error from './Pages/Error/Error';
import EmployeeList from './Pages/Employee/EmployeeList/EmployeeList';
import CreateEmployee from './Pages/Employee/CreateEmployee/CreateEmployee';
import ClientList from './Pages/Client/ClientList/ClientList';

window.recaptchaOptions = {
  lang: 'en',
  useRecaptchaNet: false,
  removeOnUnmount: true,
};

class App extends React.Component{
  state = { panelNavShow: false }

  togglePanelNav = () => {
    this.setState(() => {
      return { panelNavShow: !this.state.panelNavShow };
    });
  }

  closeNav = () => {
    this.setState(() => {
      return { panelNavShow: false };
    });
  }

  render(){
    let defaultLanguage = 'en';

    let languages = [
      { name: 'English', code: 'en' },
      { name: 'Spanish', code: 'es' }
    ];

    let options = {
      defaultLanguage: defaultLanguage,
      renderToStaticMarkup: renderToStaticMarkup
    };

    let footerContent= <p> © 2019 - TempEdge LLC. 101 N Feltus St. South Amboy NJ. 08879. <Translate id="com.tempedge.msg.label.rights"></Translate> </p>;

    let backgroundFade = (this.state.panelNavShow)? <BackgroundFade closeNav={this.closeNav} />: null;

    return(
      <Provider store={store}>
        <PersistGate loading={<LoadingView />} persistor={persistor}>
          <LocalizeProvider store={store} initialize={{ languages: languages, options: options }}>
            <Favicon url="/img/favicon.ico" />
            <ConnectedRouter history={history}>
              <div className="contents">
                <Notifications />
                <NavBar toggleNav={this.togglePanelNav} />
                <NavPanelLeft toggleNav={this.togglePanelNav} show={this.state.panelNavShow} />
                {backgroundFade}
                <Switch>
                  <Route exact path="/" component={ () => <HomePage lang={defaultLanguage} /> } />
                  <Route exact path="/auth/:lang" component={Login} />
                  <Route exact path="/register/:lang" component={CreateNewUser} />
                  <Route exact path="/registerAgency/:lang" component={CreateNewAgency} />
                  <Route exact path="/createClient/:lang" component={CreateNewClient} />
                  <Route exact path="/resetpassword/:lang" component={ForgotPassword} />
                  <Route exact path="/snapshot-desktop/:lang" component={FaceMashDesktop} />
                  <Route exact path="/upload/:lang" component={UploadFile} />
                  <Route exact path="/pending/user/:lang" component={Error} />
                  <Route exact path="/pending/agency/:lang" component={Error} />
                  <Route exact path="/denied/user/:lang" component={Error} />
                  <Route exact path="/employee/:lang" component={EmployeeList} />
                  <Route exact path="/employee/create/:lang" component={CreateEmployee} />
                  <Route exact path="/client/:lang" component={ClientList} />
                  <Route exact path="/denied/agency/:lang" component={Error} />
                  <Route exact path="/error/:lang" component={Error} />
                  <PrivateRoute exact path="/protected/:lang" redirectPath="/auth/:lang" />
                  <Route exact path="/dashboard/:lang" component={Login} />
                </Switch>
              </div>
            </ConnectedRouter>
            <Footer textColor="#fff" background="#df963d" content={footerContent} />
          </LocalizeProvider>
        </PersistGate>
      </Provider>
    );
  }
 }

 export default withLocalize(App);
