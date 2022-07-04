import React, {useState, useEffect} from 'react';

//redux
import {connect} from 'react-redux';
import {LOGOUT, AUTHORIZE} from '../actions/userAction';
//components

import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from '../components/Home';
import Feed from '../components/Feed';
import { wrapper } from '../store';
export const getServerSideProps = wrapper.getServerSideProps(store => ({req, res, ...etc}): any => {
  return {
      props: {
          test: 'test',
      }
  }
}
);
toast.configure()

function App(props) {
  const [isAuthenticated, setIsAuthenticated] = useState(props.auth);

  async function isAuth(){
    //check if isAuthenticated is already true to avoid unnecessary fetch
    // isAuthenticated will be resseet
    //console.log("hello");
    try{
      const response = await fetch(`/api/verify`,{
        method: "GET",
        headers: {token: localStorage.token}
      });

      const parseRes = await response.json();
      if(parseRes===true){
        setIsAuthenticated(true);
      }else{
        setIsAuthenticated(false);
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
  if (isAuthenticated) {
    return <Feed username={props.username}/>
  } else {
    return <Home />
  }
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
