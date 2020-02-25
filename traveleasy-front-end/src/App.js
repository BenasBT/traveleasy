import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Header from './components/header';
import {MuiThemeProvider,createMuiTheme} from "@material-ui/core";
import {amber, red} from "@material-ui/core/colors";
import Home from "./pages/home";
import Activities from "./pages/activities";
import Modal from "./components/modal";
import {createStore, useDispatch, useSelector} from "react-redux";
import {getCurrentUser} from "./utils/APIUtils";
import {setUser} from "./redux/actions";



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
  getCurrentUser().then(r => { dispatch(setUser(r)) });
  return (

    <MuiThemeProvider theme={theme}>
      <Modal/>
      <Router>
        <Header/>
        <Switch>
          <Route  path="/" component={Home} />
          <Route  path="/activities" component={Activities} />
        </Switch>
      </Router>
    </MuiThemeProvider>

  );
}

export default App;
