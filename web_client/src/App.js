import React, {Fragment, useState, useEffect} from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
//components

import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Dashboard from "./components/Dashboard";
import Dashboard2 from "./components/Dashboard2";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from './components/Home';
import Feed from './components/Feed';
import Upload from './components/Upload';
import configs from './config';
import Popular from './components/Popular';
import Contests from './components/Contests';
import Rankings from './components/Rankings';

toast.configure()

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  }
  async function isAuth(){
    //check if isAuthenticated is already true to avoid unnecessary fetch
    // isAuthenticated will be resseet
    //console.log("hello");
    try{
      const response = await fetch(`${configs.api.url}:${configs.api.port}/auth/verify`,{
        method: "GET",
        headers: {token: localStorage.token}
      });

      const parseRes = await response.json();
      parseRes === true ? setIsAuthenticated(true):setIsAuthenticated(false);
      //console.log(parseRes);
    }catch(err){
      console.log(err.message);
    }
    return isAuthenticated;
  }
  useEffect(()=>{
    
    isAuth();
  })
  return (
  <Fragment>
    <Router>
      <div>
        <Switch>
        <Route exact path = "/" render={props=>
          !isAuthenticated ? (
            <Home {...props}/>
          )
            :(
            <Feed {...props}/>
          )
        }/>
        <Route 
          exact path = "/login" 
          render={props=>
            !isAuthenticated ? (
              <Login {...props} setAuth = {setAuth}/>
            )
              :(
              <Redirect to = "/"/>
            )
          }/>
          <Route exact path = "/upload" render={props=>
            isAuthenticated ? (
              <Upload {...props} setAuth = {setAuth}/>
            )
            :(
              <Redirect to = "/"/>
            )
          }/>
          <Route exact path = "/popular" render={props=>
            isAuthenticated ? (
              <Popular {...props} setAuth = {setAuth}/>
            )
            :(
              <Redirect to = "/"/>
            )
          }/>
          <Route exact path = "/rankings" render={props=>
            isAuthenticated ? (
              <Rankings {...props} setAuth = {setAuth}/>
            )
            :(
              <Redirect to = "/"/>
            )
          }/>
          <Route exact path = "/contests" render={props=>
            isAuthenticated ? (
              <Contests {...props} setAuth = {setAuth}/>
            )
            :(
              <Redirect to = "/"/>
            )
          }/>
          <Route 
            exact path = "/register" 
            render={props=> !isAuthenticated ?
            <Register {...props} setAuth = {setAuth}/>:<Redirect to="/"/>
          }/>
          
          <Route path = "/dashboard" >
                {isAuthenticated?
              <Dashboard setAuth = {setAuth}/>:
              <Redirect to="/"/>}
          </Route>
          <Route path = "/:username" component={Dashboard2}/>
        </Switch>
      </div>
    </Router>
  </Fragment>);
}

export default App;
