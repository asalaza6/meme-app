import React, { useEffect, useState } from "react";
import {toast} from 'react-toastify';
import configs from '../config';
import Post from './Post2';
import {Box, Avatar, Heading,  Button, Flex } from "@chakra-ui/react";
import SideMenu from "./Drawer";
class Dashboard extends React.Component {
    constructor(){
        super();
        this.state = {
            name:"",
            images:[]
        }
        this.getName = this.getName.bind(this);
        this.getProfileImages = this.getProfileImages.bind(this);
        this.logout = this.logout.bind(this);
    }
    async getName(){
        try{
            const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard`,{
                method: "GET",
                headers:{
                    token: localStorage.token
                }
            });
            const parseRes = await response.json();
            this.setState({name:parseRes.user_name});
        }catch(err){
            console.log(err.message);
        }
    }

    async getProfileImages(){
        let images = [];
        let param = "";
        if(this.props.match){
            param = this.props.match.params.username;
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
        this.setState({images:images});

    }
    logout(e){
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logout successfully");
    }
    componentDidUpdate(){
        if(this.props.match.params.username != this.state.name){
            //console.log(this.props.match);
            const {params: {username}} = this.props.match;
            this.setState({name:username});
            this.getProfileImages();
        }
    }
    componentDidMount(){
        //console.log("mount");
        if(this.props.match){
            const {params: {username}} = this.props.match;
            this.setState({name:username});
        }else{
            this.getName();
        }
        this.getProfileImages();
        //console.log("useeffect");
    }
    render(){
    return (
        <Box alignItems="center" flexDirection="column" display = "flex">
            <SideMenu heading={this.state.name}/>
            
            <Flex direction = "column" align = "center" maxW="700px">
                <Avatar p = "10px" size="2xl" name="Segun Adebayo" src="https://i.pravatar.cc/300" />{" "}
                {!this.props.match?
                    <Button  p = "10px" onClick={e=>this.logout(e)}>Logout</Button>
                :null
                }<Heading color = "grey" p = "10px" textAlign = 'center'>Posts</Heading>
                {this.state.images.map((img,index)=>{return( 
                   <Post img={img} key={index}/>
                )})}
            </Flex>
        </Box>
    )}
}

export default Dashboard;
