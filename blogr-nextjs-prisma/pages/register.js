import React, { useState } from "react";
import { toast } from "react-toastify";
import configs from '../config';
import {ADD_USER, AUTHORIZE} from '../actions/userAction';
import {connect} from 'react-redux';
import {Flex, Heading, Button, Input, Stack } from "@chakra-ui/react";
const Register = ({setAuth,addUser,authorize}) =>{
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
        confirm: "",
        name:""
    });
    
    const {email, password, name, confirm} = inputs;

    const onChange = (e)=>{
        setInputs({...inputs,[e.target.name]
        : e.target.value})
    }

    const onSubmitForm = async (e)=>{
        e.preventDefault();
        if(confirm !== password){
            toast.error("Passwords don't match");
            return;
        }
        try{
            const body = {email,password,name};
            const response = await fetch(`/api/register`,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(body)
                });

            const parseRes = await response.json();
            if(parseRes.token){

                localStorage.setItem("token", parseRes.token);
                //console.log(addUser,authorize);
                addUser(parseRes.user_name);
                authorize(parseRes.token);
                // localStorage.setItem("user", parseRes.user_id);
                setAuth(true);
                toast.success("Registered Successfully!");
            }else{
                console.log("error parseRes");
                toast.error(parseRes);
            }
        }catch(err){
            console.error(err.message);
        }
    }

    return (
        <Flex justify="center" h="100vh" direction="column" align="center" >
            <Heading p="20px" >Register</Heading>
            <Stack w="90vw" maxW="700px" >
                <Input 
                    type = "email" 
                    name="email" 
                    placeholder="email" 
                    value={email}
                    onChange={e=>onChange(e)}
                />
                <Input type = "text" name="name" placeholder="username" 
                    value={name}
                    onChange={e=>onChange(e)}/>
                <Input type = "password" name="password" placeholder="password" 
                    value={password}
                    onChange={e=>onChange(e)}/>
                <Input type = "password" name="confirm" placeholder="confirm password" 
                    value={confirm}
                    onChange={e=>onChange(e)}/>
                <Button onClick={onSubmitForm}>Submit</Button>
            </Stack>
        </Flex>
    )
}
const mapDispatchToProps = (dispatch) =>{
    return {
        addUser : (username) => dispatch({type: ADD_USER,payload: {username}}),
        authorize: (token) => dispatch({type: AUTHORIZE, payload: {token}})
    }
};
export default connect(null,mapDispatchToProps)(Register);

