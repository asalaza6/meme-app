import React from "react";
import {toast} from 'react-toastify';
import configs from '../config';
import Post from './Post';
import {Box, Stack,Avatar, Heading,  Button, Flex, Text, Input} from "@chakra-ui/react";
import SideMenu from "./Drawer";
import {connect} from 'react-redux';

import Compress from "react-image-file-resizer";

class Dashboard extends React.Component {
    constructor(props){
        super(props);
        //console.log(props);
        this.state = {
            name:"",
            images:[],
            owner: this.props.match.params.username === this.props.username,
            following:false,
            uploadOpen: false,
            uploadContents: null,
            uploadFile: null //check if profile image exists
        }
        //check if profile image exists

        //console.log(configs.images.profileLocation+this.props.username);
        
        this.getProfileImages = this.getProfileImages.bind(this);
        this.logout = this.logout.bind(this);
        this.follow = this.follow.bind(this);
        this.isFollowing = this.isFollowing.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        localStorage.removeItem("persist:root");
        window.location.href = "/";
        toast.success("Logout successfully");
    }
    async follow(e){
        e.preventDefault();
        // use this.props.username and followee's username to send follow request and 
        let body = {
            follower:this.props.username,
            followee: this.props.match.params.username,
            state: this.state.following
        }
        try{
            const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard/follow`,{
                method: "POST",
                headers:{
                    token: localStorage.token,
                    "Content-Type": "application/json",
                },
                body:JSON.stringify(body)
            });
            // const parseRes = await response.json();
            //console.log("follow",parseRes);
            this.setState({following:!this.state.following});
            toast.success(`${this.state.following?"Follow":"Unfollow"} successfully`);
        }catch(err){
            console.log(err.message);
        }
    }
    async isFollowing(){
        // use this.props.username and followee's username to check if following
        
        try{
            const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard/follow`,{
                method: "GET",
                headers:{
                    token: localStorage.token,
                    follower:this.props.username,
                    followee: this.props.match.params.username
                }
            });
            const parseRes = await response.json();
            //console.log("ISfollow",parseRes);
            this.setState({following:parseRes});
        }catch(err){
            console.log(err.message);
        }
        //console.log(images);
    }
    componentDidUpdate(){
        if(this.props.match.params.username !== this.state.name){
            //console.log(this.props.match);
            const {params: {username}} = this.props.match;
            this.setState({name:username,owner:this.props.match.params.username === this.props.username});
            this.getProfileImages();
            this.isFollowing();
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
        this.isFollowing();
        //console.log("useeffect");
    }
    async handleSubmit(){
        if(this.state.uploadFile === null){
            alert('file not chosen');
            this.setState({uploadOpen:false});
            return;
        }
        let body = {
            name:this.state.uploadFile.name,
            content:this.state.uploadContents,
            type: "profile",
            user_name:this.props.username
        }
        
        try{
            const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard/upload`,{
                method: "POST",
                headers:{
                    token: localStorage.token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body)
            });
            await response.json().then(()=>{
                
            });
            //console.log(parseRes);
            this.setState({uploadContents:null});
            this.setState({uploadFile:null});
            this.setState({uploadOpen:false});
            toast.success("Upload successful!");
            window.location.reload(false);
        }catch(err){
            console.log(err.message);
            this.setState({uploadOpen:false});
        }
    }
    onChange(evt){
        let file = evt.target.files[0];

        //console.log(file);
        
        if(!file){
            this.setState({uploadContents:null});
            return;
        }else{
            this.setState({uploadFile:file});
        }
        Compress.imageFileResizer(
            file, // the file from input
            480, // width
            480, // height
            "JPEG", // compress format WEBP, JPEG, PNG
            70, // quality
            0, // rotation
            (uri) => {
                this.setState({uploadContents:uri});
            // You upload logic goes here
            },
            "base64" // blob or base64 default base64
        );
    }
    
    render(){
    return (
        <Box minH = "100vh" w = "100%" alignItems="center" flexDirection="column" display = "flex">
            <SideMenu heading={this.state.name}/>
            
            <Flex direction = "column" align = "center" w = "100%" maxW="700px">
                <Box rounded="md" align="center" width="200px" h= "200px" position = "relative" >
                    <Avatar boxShadow = "xl" size="full" src={configs.images.profileLocation+this.state.name+".jpeg"} />
                    {this.state.owner?(this.state.uploadOpen?
                    <Box boxShadow = "xl" p = "10px"  rounded="md" bg = "white"  left="0" top ="0" bottom ="0" position="absolute"   >
                        <Input size="xs"  p = "0" m = "0" onInput={this.onChange} accept="image/png, image/jpeg" type="file"/>
                        <Button m = "10px" p = "10px" onClick={()=>{this.handleSubmit()}}>Submit</Button>
                        <Button onClick={()=>{this.setState({uploadOpen:false})}} boxShadow = "2xl"  p = "15px"  rounded="2xl" bg = "white"  right="0" bottom ="0" position="absolute"   >
                            <Text align="center" justify="center">x</Text>
                        </Button>
                    </Box>  
                        :
                    <Button onClick={()=>{this.setState({uploadOpen:true})}} boxShadow = "2xl"  p = "15px"  rounded="2xl" bg = "white"  right="0" bottom ="0" position="absolute"   >
                        <Text align="center" justify="center">+</Text>
                    </Button>):null}
                </Box>
                {this.state.owner?
                    <Button m="10px" p = "10px" onClick={e=>this.logout(e)}>Logout</Button>
                :(this.state.following?
                    <Button m="10px" p = "10px" onClick={e=>this.follow(e)}>Unfollow</Button>:
                    <Button m="10px" p = "10px" onClick={e=>this.follow(e)}>Follow</Button>
                )
                }
                <Heading color = "grey" p = "10px" textAlign = 'center'>Posts</Heading>
                <Stack m="20px" justify="center" align="center">
                    {this.state.images.map((img,index)=>{return( 
                        <Post img={img} key={index}/>
                    )})}
                </Stack>
            </Flex>
        </Box>
    )}
}

const mapStateToProps = state => ({
    username: state.user.username
})
export default connect(mapStateToProps,null)(Dashboard);

