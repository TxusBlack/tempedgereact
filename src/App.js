import 'babel-polyfill';
import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Favicon from 'react-favicon';
import { LocalizeProvider, Translate, withLocalize } from 'react-localize-redux';
import { Provider } from "react-redux";
import { Route, Switch } from 'react-router-dom';
import { PersistGate } from 'redux-persist/lib/integration/react';
import Footer from './components/common/Footer/Footer';
import LoadingView from './components/common/LoadingSplashScreen/LoadingSplashScreen';
import NavBar from './components/common/NavBar/NavBar';
import BackgroundFade from './components/common/NavPanelLeft/BackgroundFade.js';
import NavPanelLeft from './components/common/NavPanelLeft/NavPanelLeft.js';
import Notifications from './components/common/Notifications/Notifications';
import PrivateRoute from './components/common/PrivateRoute/PrivateRoute';
import UploadFile from './components/common/UploadFile/UploadFile';
import GenericDashboard from './Pages/Dashboard/GenericDashboard';
import EmployeeList from './Pages/Employee/EmployeeList';
import Error from './Pages/Error/Error';
import FaceMashDesktop from './Pages/FaceMash/FaceMashDesktop';
import FaceMashMobile from './Pages/FaceMash/FaceMashMobile';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword';
import HomePage from './Pages/Home/Home';
import CreateNewAgency from './Pages/Login/CreateNewAgency/CreateNewAgency';
import CreateNewUser from './Pages/Login/CreateNewUser/CreateNewUser';
import Login from './Pages/Login/Login';
import { history, persistor, store } from './store/store';
//import Welcome from './Pages/Welcome/Welcome';
//import ApproveUser from './Pages/ApproveUser/ApproveUser';

window.recaptchaOptions = {
  lang: 'en',
  useRecaptchaNet: false,
  removeOnUnmount: true,
};

class App extends React.Component{
  constructor(props){
    super(props);
  }

  state = { panelNavShow: false }

  togglePanelNav = () => {
    this.setState(() => {
      return { panelNavShow: !this.state.panelNavShow };
    }, () => {
      console.log("panelNavShow: ", this.state.panelNavShow);
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

    let footerContent= <p> © 2019 - TempEdge LLC. 101 N Feltus St. South Amboy NJ. 08879. <Translate id="com.tempedge.msg.label.rights">All rights reserved.</Translate> </p>;

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
                  <Route exact path="/resetpassword/:lang" component={ForgotPassword} />
                  <Route exact path="/snapshot-mobile/:lang" component={FaceMashMobile} />
                  <Route exact path="/snapshot-desktop/:lang" component={FaceMashDesktop} />
                  <Route exact path="/upload/:lang" component={UploadFile} />
                  <Route exact path="/pending/user/:lang" component={Error} />
                  <Route exact path="/pending/agency/:lang" component={Error} />
                  <Route exact path="/denied/user/:lang" component={Error} />
                  <Route exact path="/employee/:lang" component={EmployeeList} />
                  <Route exact path="/denied/agency/:lang" component={Error} />
                  <Route exact path="/error/:lang" component={Error} />
                  <PrivateRoute exact path="/protected/:lang" redirectPath="/auth/:lang" />
                  <Route exact path="/dashboard/:lang" component={GenericDashboard} />
                </Switch>
              </div>
            </ConnectedRouter>
            <Footer content={footerContent} />
          </LocalizeProvider>
        </PersistGate>
      </Provider>
    );
  }
 }

 export default withLocalize(App);
