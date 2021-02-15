import React, { useEffect, useState } from "react";
import {toast} from 'react-toastify';
import configs from '../config';
import Post from './Post';
import {Box, Avatar, Heading,  Button, Flex } from "@chakra-ui/react";
import SideMenu from "./Drawer";
const Dashboard = ({setAuth,match})=> {
    const [name, setName] = useState("");
    const [images, setImages] = useState([]);
    async function getName(){
        try{
            const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard`,{
                method: "GET",
                headers:{
                    token: localStorage.token
                }
            });
            const parseRes = await response.json();
            //console.log(parseRes);
            setName(parseRes.user_name);
        }catch(err){
            
        }
    }

    async function getProfileImages(){
        let images = [];
        let param = "";
        if(match){
            param = match.params.username;
        }
        try{
            const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard/profileimages`,{
                method: "GET",
                headers:{
                    token: localStorage.token,
                    name: param
                }
            });
            const parseRes = await response.json();
            //console.log(parseRes);
            for(var i = 0;i<parseRes.rows.length;i++){
                //will add to database later
                images.push(parseRes.rows[i]);
            }
            
        }catch(err){
            console.log(err.message);
        }
        //console.log(images);
        setImages(images);

    }
    const logout = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuth(false);
        toast.success("Logout successfully");
    }
    useEffect(()=>{
        if(match){
            const {params: {username}} = match;
            setName(username);
        }else{
            getName();
        }
        getProfileImages();
        //console.log("useeffect");
    },[]);
    return (
        <Box alignItems="center" flexDirection="column" display = "flex">
            <SideMenu heading={name}/>
            
            <Flex direction = "column" align = "center" maxW="700px">
                
                <Avatar p = "10px" size="2xl" name="Segun Adebayo" src="https://i.pravatar.cc/300" />{" "}
                {!match?
                    <Button  p = "10px" onClick={e=>logout(e)}>Logout</Button>
                :null
                }<Heading color = "grey" p = "10px" textAlign = 'center'>Posts</Heading>
                {images.map((img,index)=>{return( 
                   <Post img={img} key={index}/>
                )})}
            </Flex>
        </Box>
    )
}

export default Dashboard;
