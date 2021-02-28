
import React, {  useEffect, useState } from "react";
import configs from '../config';
import {Box,Input,  Flex, Button, Image } from "@chakra-ui/react";
import { Avatar, Text, IconButton, Stack} from "@chakra-ui/react";
import {DeleteIcon, ChatIcon, CheckIcon} from "@chakra-ui/icons";
class Post extends React.Component {//({img,index})=>
    constructor(props){
        super();
        this.state = {
            comment:false,
            comments:[],
            commentsLeft:0,
            liked:false,
            img:props.img
        }
        this.getComments = this.getComments.bind(this);
        this.checkLike = this.checkLike.bind(this);
        this.likeImage = this.likeImage.bind(this);
        this.addComment = this.addComment.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
    }

    async getComments(img){
        
        try{
            const length = this.state.comments.length;
            const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard/comments`,{
                method: "GET",
                headers:{
                    token: localStorage.token,
                    image:img.image_id,
                    count: length
                }
            });
            const parseRes = await response.json();
            // console.log(parseRes);
            for(let i = 0; i < parseRes.comments.rows.length;i++){
                this.state.comments.push(parseRes.comments.rows[i]);
            }
            this.setState({comments:this.state.comments});
            var left = parseRes.count.rows[0].count-this.state.comments.length;
            //console.log(left);
            this.setState({commentsLeft:left});
            //console.log(img.comments);
        }catch(err){
            console.log(err.message);
        }
        
    }
    async checkLike(img){
        try{
            const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard/likeimage`,{
                method: "GET",
                headers:{
                    token: localStorage.token,
                    image: img.image_id,
                    user: localStorage.user
                }
            });
            const parseRes = await response.json();
            //console.log(parseRes);
            this.setState({liked:parseRes});
            
           // console.log("checking img",img.image_id,parseRes);
            //console.log(img.comments);
        }catch(err){

        }
          
    }
    async likeImage(img){
        let body = {
            image: img.image_id,
            liked: this.state.liked,
            user: localStorage.user
        }
        try{
            const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard/likeimage`,{
                method: "POST",
                headers:{
                    token: localStorage.token,
                    "Content-Type": "application/json",
                },
                body:JSON.stringify(body)
            });
            const parseRes = await response.json();
            //console.log(parseRes);
            this.setState({liked:parseRes});
            //console.log(img.comments);
        }catch(err){

        }
          
    }
    async addComment(img,content){
        let body = {
            image: img.image_id,
            content: content
        }
        //console.log(body);
        try{
            const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard/comments`,{
                method: "POST",
                headers:{
                    token: localStorage.token,
                    "Content-Type": "application/json",
                },
                body:JSON.stringify(body)
            });
            const parseRes = await response.json();
           // console.log("parse",parseRes);
            var id = parseRes[0].comment_id;
            
        }catch(err){
            console.log(err.message);
        }

        this.state.comments.unshift({
            comment_content:content,
            create_timestamp:"right now",
            comment_id: id,
            user_id:localStorage.user
        });
        this.setState({comments:this.state.comments});
    }
    async deleteComment(comment){
        //console.log(comments,comment);
        //remove off memory
        for(var i=0; i< this.state.comments.length;i++){
            if(this.state.comments[i].comment_id === comment.comment_id){
                
                //console.log(i,this.state.comments[i].comment_content);
                this.state.comments.splice(i,1);
                this.setState({comments:this.state.comments});
                break;
            }
        }
        //console.log(comment);
        //remove off server
        let {comment_id} = comment;
        let body = {
            comment: comment_id,
        }
        try{
            const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard/deletecomment`,{
                method: "POST",
                headers:{
                    token: localStorage.token,
                    "Content-Type": "application/json",
                },
                body:JSON.stringify(body)
            });
            const parseRes = await response.json();
            //console.log("parse",parseRes);
            //var id = parseRes[0].comment_id;
            
        }catch(err){
            console.log(err.message);
        }
    }
    componentDidUpdate(){
        if(this.props.img != this.state.img){
            //console.log("updating img state",this.props.img);
            this.setState({img:this.props.img});
            this.checkLike(this.props.img);
        }
    }
    componentDidMount(){
        this.setState({img:this.props.img});
        
       // console.log("update img");
        this.checkLike(this.state.img);

    }
    render(){
    return (
        <Box w = "300px">
            <Image alt= "BIG MEME"  key = {this.props.index}src={configs.images.location+this.state.img.image_id+"."+this.state.img.image_type}/>
            <Flex direction="row">
            <IconButton
                p = "20px"variant="ghost" h = "30px"  flex={1}
                    aria-label="Like"
                    icon={<CheckIcon/>}
                    onClick={()=>{this.likeImage(this.state.img);}}
                    color={this.state.liked?"green.400":"red.400"}
                    />
                <IconButton
                p = "20px"variant="ghost" h = "30px"  flex={1}
                    aria-label="Chat"
                    color="blue.400"
                    icon={<ChatIcon/>}
                    onClick={()=>{
                        this.setState({comment:!this.state.comment});
                        if(this.state.comments.length===0){
                            this.getComments(this.state.img)
                        }
                    }}
                    />
            </Flex>
            {this.state.comment?
                <Stack direction="column-reverse">
                    <Flex direction="row">
                        <Input type = "text" id = {"comment"+this.state.img.image_id}/>
                        <Button onClick={()=>{
                            let text = document.getElementById("comment"+this.state.img.image_id);
                            this.addComment(this.state.img,text.value);
                            text.value="";}}>Submit</Button>
                    </Flex>
                    {this.state.comments.map((comment,index)=>{
                        return(
                        <Flex align="center" justify="space-between" direction = "row" key = {index}>
                            <Box flex={1} justifyContent="center">
                                <Avatar   size="sm" name="Segun Adebayo" src="https://i.pravatar.cc/300" />{" "}
                            </Box>
                            <Text flex={9}>
                                {comment.comment_content}
                            </Text>
                            {localStorage.user === comment.user_id?
                            <IconButton
                                onClick={()=>{this.deleteComment(comment)}}
                                aria-label="Delete"
                                icon={<DeleteIcon/>}
                                />:null}
                        </Flex>
                    )})}
                    {this.state.commentsLeft!== 0?
                    <Button variant="link" onClick={()=>{
                        this.getComments(this.state.img);
                    }}>Show more comments</Button>:null}
                </Stack>
                :
                null
            }
        </Box>
    )}
}
export default Post;
