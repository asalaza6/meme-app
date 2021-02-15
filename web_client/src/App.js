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
import Login from "./components/Login";
import Register from "./components/Register";
import Home from './components/Home';
import Feed from './components/Feed';
import Upload from './components/Upload';
import configs from './config';

toast.configure()

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    console.log("changing auth\n");
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
      console.log("VErifying:", parseRes);
      parseRes === true ? setIsAuthenticated(true):setIsAuthenticated(false);
      //console.log(parseRes);
    }catch(err){
      console.log(err.message);
    }
    return isAuthenticated;
  }
  useEffect(()=>{
    
    isAuth();
    console.log("useeffect",isAuthenticated);
  })
  return (
  <Fragment>
    <Router>
      <div>
        <Switch>
        <Route exact path = "/" render={props=>
         console.log(isAuthenticated)|| !isAuthenticated ? (
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
          <Route 
            exact path = "/register" 
            render={props=> !isAuthenticated ?
            <Register {...props}setAuth = {setAuth}/>:<Redirect to="/"/>
          }/>
          <Route path = "/dashboard" >
                {isAuthenticated?
              <Dashboard setAuth = {setAuth}/>:
              <Redirect to="/"/>}
          </Route>
          <Route path = "/:username" component={Dashboard}/>
        </Switch>
      </div>
    </Router>
  </Fragment>);
}

export default App;
