import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Header from './common/header';
import {MuiThemeProvider,createMuiTheme} from "@material-ui/core";
import {amber, red} from "@material-ui/core/colors";
import Home from "./pages/home";
import Services from "./pages/services";
import Modal from "./components/modal";
import {createStore, useDispatch, useSelector} from "react-redux";
import {getCurrentUser} from "./utils/APIUtils";
import {setUser} from "./redux/actions";
import OAuth2RedirectHandler from "./user/oauth2/OAuth2RedirectHandler";
import MyProfile from "./pages/profile/MyProfile";
import Profile from "./pages/profile/Profile";
import AdminPage from './pages/admin';
import Service from './pages/service/Service';
import ServicesMy from './pages/services/ServicesMy';
import AddService from './pages/service/AddService';


function App() {

  const theme = createMuiTheme({
    palette: {
      primary: red,
      secondary: {
        main: amber.A400,
        light: amber[200],
        dark: amber[700]
      },
      //type: 'dark'

    },


  });
  const dispatch = useDispatch();

  getCurrentUser(dispatch).then();
  return (

    <MuiThemeProvider theme={theme}>
      <Modal/>
      <Router>
        <Header/>
        <Switch>
          <Route path="/oauth2/redirect" component={OAuth2RedirectHandler}/>
          <Route path="/admin" component={AdminPage}/>
          <Route path="/profile/me" component={MyProfile}/>
          <Route path="/profile/:id" component={Profile} />

          <Route path="/services/my" component={ServicesMy} />
          <Route path="/services" component={Services} />

          <Route path="/service/add" component={AddService} />
          <Route path="/service/:id" component={Service} />

          <Route path="/" component={Home} />
        </Switch>
      </Router>
    </MuiThemeProvider>

  );
}

export default App;
