import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Header from './components/header';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {MuiThemeProvider,createMuiTheme} from "@material-ui/core";
import {amber, blue, lightGreen, red, yellow} from "@material-ui/core/colors";
import {dark} from "@material-ui/core/styles/createPalette";
import Home from "./pages/home";
import Activities from "./pages/activities";
import Modal from "./components/modal";



function App() {

  const theme = createMuiTheme({
    palette: {
      primary: red,
      secondary: {
        main: amber.A400,
        light: amber[200],
        dark: amber[700]
      },


    },
      type: 'dark'

  });

  console.log(theme);

  return (

    <MuiThemeProvider theme={theme}>
    <Router>
      <Header/>
      <Switch>
        <Modal/>
        <Route exact path="/" component={Home} />
        <Route exact path="/activities" component={Activities} />
      </Switch>
    </Router>
    </MuiThemeProvider>

  );
}

export default App;
