import React, {useState, useEffect} from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
//redux
import {connect} from 'react-redux';
import {LOGOUT, AUTHORIZE} from './actions/userAction';
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
import Popular from './components/Popular';
import Contests from './components/Contests';
import Rankings from './components/Rankings';

toast.configure()

function App(props) {
  const [isAuthenticated, setIsAuthenticated] = useState(props.auth);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  }
  console.log("isAuthenticated",props.auth,isAuthenticated);
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
      if(parseRes===true){
        setIsAuthenticated(true);
      }else{
        setIsAuthenticated(false);
        console.log(props.username, props.auth);
        if(localStorage.token){
          localStorage.removeItem("token");
        }
        if(props.username || props.auth){
          props.logout();
        }
      }

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
    <Router>
      <Switch>
      <Route exact path = "/" render={(props)=>{
        if(isAuthenticated){
          return <Feed {...props}/>
        }else{
          return <Home {...props}/>
        }}
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
        
        <Route path = "/:username"  render={({match})=> 
        isAuthenticated ?
          <Dashboard match = {match}  setAuth = {setAuth}/>:<Redirect to="/"/>
        }/>
      </Switch>
    </Router>
  );
}
const mapStateToProps = state => ({
  username: state.user.username,
  auth: state.user.auth
});

const mapDispatchToProps = (dispatch) =>{
  return {
      // addUser : (username, id) => dispatch({type: ADD_USER,payload: {username, id}}),
      authorize: (auth) => dispatch({type: AUTHORIZE, payload: {auth}}),
      logout: ()=>dispatch({type: LOGOUT})
  }
};
export default connect(mapStateToProps,mapDispatchToProps)(App);
