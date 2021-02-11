
import React, { Fragment, useEffect, useState } from "react";
import { Link} from 'react-router-dom';
import configs from '../config';
import {Box,Input,  Flex, Button, Image } from "@chakra-ui/react";
import { Avatar, Text, DrawerOverlay,DrawerFooter, DrawerBody,DrawerCloseButton,DrawerHeader,DrawerContent, Heading, IconButton, Stack, useDisclosure } from "@chakra-ui/react";
import {DeleteIcon, ChatIcon, CheckIcon} from "@chakra-ui/icons";
const Post = ({img,index})=>{
    const [comment, openComment] = useState(false);
    const [comments, addComments] = useState([]);
    const [commentsLeft,updateCommentsLeft] = useState(0);
    const [liked, updateLike] = useState(false);
    async function getComments(img){
        
        try{
            const count = comments.length;
            const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard/comments`,{
                method: "GET",
                headers:{
                    token: localStorage.token,
                    image:img.image_id,
                    count, count
                }
            });
            const parseRes = await response.json();
            //console.log(parseRes);
            for(let i = 0; i < parseRes.comments.rows.length;i++){
                comments.push(parseRes.comments.rows[i]);
            }
            addComments([...comments]);
            var left = parseRes.count.rows[0].count-comments.length;
            //console.log(left);
            updateCommentsLeft(left);
            //console.log(img.comments);
        }catch(err){
            console.log(err.message);
        }
        
    }
    async function checkLike(img){
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
           // console.log(parseRes);
            updateLike(parseRes);
            //console.log(img.comments);
        }catch(err){

        }
          
    }
    async function likeImage(img){
        let body = {
            image: img.image_id,
            liked: liked,
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
            updateLike(parseRes);
            //console.log(img.comments);
        }catch(err){

        }
          
    }
    async function addComment(img,content){
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

        comments.unshift({
            comment_content:content,
            create_timestamp:"right now",
            comment_id: id,
            user_id:localStorage.user
        });
        addComments([...comments]);
    }
    async function deleteComment(comment){
        //console.log(comments,comment);
        //remove off memory
        for(var i=0; i< comments.length;i++){
            if(comments[i].comment_id == comment.comment_id){
                
                //console.log(i,comments[i].comment_content);
                comments.splice(i,1);
                addComments([...comments]);
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
    useEffect(()=>{
        checkLike(img);
    },[]);
    return (
        <Box w = "300px">
            <Image alt= "BIG MEME"  key = {index}src={configs.images.location+img.image_id+"."+img.image_type}/>
            <Flex direction="row">
            <IconButton
                p = "20px"variant="ghost" h = "30px"  flex={1}
                    aria-label="Like"
                    icon={<CheckIcon/>}
                    onClick={()=>{likeImage(img);}}
                    color={liked?"green.400":"red.400"}
                    />
                <IconButton
                p = "20px"variant="ghost" h = "30px"  flex={1}
                    aria-label="Chat"
                    color="blue.400"
                    icon={<ChatIcon/>}
                    onClick={()=>{
                        openComment(!comment);
                        if(comments.length==0){
                            getComments(img)
                        }
                    }}
                    />
            </Flex>
            {comment?
                <Stack direction="column-reverse">
                    <Box>
                        <Input type = "text" id = {"comment"+img.image_id}/>
                        <Button onClick={()=>{
                            let text = document.getElementById("comment"+img.image_id);
                            addComment(img,text.value);
                            text.value="";}}>Submit</Button>
                    </Box>
                    {comments.map((comment,index)=>{
                        return(
                        <Flex align="center" justify="space-between" direction = "row" key = {index}>
                            <Box flex={1} justifyContent="center">
                                <Avatar   size="sm" name="Segun Adebayo" src="https://i.pravatar.cc/300" />{" "}
                            </Box>
                            <Text flex={9}>
                                {comment.comment_content}
                            </Text>
                            {localStorage.user == comment.user_id?
                            <IconButton
                                onClick={()=>{deleteComment(comment)}}
                                aria-label="Delete"
                                icon={<DeleteIcon/>}
                                />:null}
                        </Flex>
                    )})}
                    {commentsLeft!= 0?
                    <Button variant="link" onClick={()=>{
                        getComments(img);
                    }}>Show more comments</Button>:null}
                </Stack>
                :
                null
            }
        </Box>
    )
}
export default Post;
