import React, { Fragment, useState } from "react";
import { toast } from "react-toastify";
import configs from '../config';

import {Box,Flex, Heading, Text, Button, Input, Stack } from "@chakra-ui/react";
const Register = ({setAuth}) =>{

    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    });
    
    const {email, password, name} = inputs;

    const onChange = (e)=>{
        setInputs({...inputs,[e.target.name]
        : e.target.value})
    }

    const onSubmitForm = async (e)=>{
        e.preventDefault();

        try{
            const body = {email,password,name};
            const response = await fetch(`${configs.api.url}:${configs.api.port}/auth/register`,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(body)
                });

            const parseRes = await response.json();
            if(parseRes.token){

                localStorage.setItem("token", parseRes.token);

                setAuth(true);
                toast.success("Registerd Successfully!");
            }else{
                toast.error(parseRes);
            }
        }catch(err){
            console.error(err.message);
        }
    }

    return (
        <Flex justify="center" h="100vh" direction="column" align="center" >
            <Heading p="20px" >Register</Heading>
            <Stack w="700px" >
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
                <Input type = "text" name="name" placeholder="name" 
                    value={name}
                    onChange={e=>onChange(e)}/>
                <Button onClick={onSubmitForm}>Submit</Button>
            </Stack>
        </Flex>
    )
}

export default Register;
