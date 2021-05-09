import React, { useState } from "react";
import {toast} from 'react-toastify';
import configs from '../config';
import {Heading, Flex, Button, Input, Stack } from "@chakra-ui/react";
import {connect} from 'react-redux';
import {ADD_USER} from '../actions/userAction';
import {AUTHORIZE} from '../actions/authAction';
const Login = (props)=>{
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    });
    const {email, password} = inputs;

    const onChange = (e)=>{
        setInputs({...inputs,[e.target.name]
        : e.target.value})
    }

    const onSubmitForm = async (e)=>{
        e.preventDefault();

        try{
            const body = {email,password};
            //console.log(body);
            const response = await fetch(`${configs.api.url}:${configs.api.port}/auth/login`,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(body)
                });

            const parseRes = await response.json();
            if(parseRes.token){
                localStorage.setItem("token", parseRes.token);
                localStorage.setItem("user", parseRes.user_id);
                //console.log(props,"add",parseRes);
                props.addUser(parseRes.user_name, parseRes.user_id);
                props.authorize(parseRes.token);
                //console.log(parseRes);
                //console.log(parseRes);
                props.setAuth(true);
                toast.success("login successful");
            }else{
                props.setAuth(false);
                toast.error(parseRes);
            }
            
        }catch(err){
            console.error(err.message);
        }
    }

    return (
        <Flex justify="center" h="100vh" direction="column" align="center" >
            <Heading p = "20px">Login</Heading>
            <Stack w="90vw" maxW="700px">
                <Input 
                    type = "email" 
                    name="email" 
                    placeholder="email" 
                    value={email}
                    onChange={e=>onChange(e)}
                />
                <Input type = "password" name="password" placeholder="password" 
                    value={password}
                    onChange={e=>onChange(e)}/>
                <Button onClick={onSubmitForm}>Submit</Button>
            </Stack>
        </Flex>
    )
}
const mapStateToProps = state => ({
    username: state.user.currentUser
});

const mapDispatchToProps = (dispatch) =>{
    return {
        addUser : (username, id) => dispatch({type: ADD_USER,payload: {username, id}}),
        authorize: (token) => dispatch({type: AUTHORIZE, payload: {token}})
    }
};
export default connect(null,mapDispatchToProps)(Login);

