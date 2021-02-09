
import React, { Fragment, useState } from "react";
import { Link} from 'react-router-dom';
import configs from '../config';
import {Box,Input,  Flex, Button, Image } from "@chakra-ui/react";
import { Avatar, Text, DrawerOverlay,DrawerFooter, DrawerBody,DrawerCloseButton,DrawerHeader,DrawerContent, Heading, IconButton, Stack, useDisclosure } from "@chakra-ui/react";
import {DeleteIcon} from "@chakra-ui/icons";
const Post = ({img,index})=>{
    const [comment, openComment] = useState(false);
    const [comments, addComments] = useState([]);
    async function getComments(img){
        let temp = [];
        try{
            const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard/comments`,{
                method: "GET",
                headers:{
                    token: localStorage.token,
                    image:img.image_id
                }
            });
            const parseRes = await response.json();
            
            for(let i = 0; i < parseRes.rows.length;i++){
                temp.push(parseRes.rows[i]);
            }
            console.log(temp)
            addComments(temp);
            //console.log(img.comments);
        }catch(err){
            //console.log(err.message);
        }
        
    }
    async function addComment(img,content){
        let body = {
            image: img.image_id,
            content: content
        }
        console.log(body);
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
            console.log("parse",parseRes);
            var id = parseRes[0].comment_id;
            
        }catch(err){
            console.log(err.message);
        }

        comments.push({
            comment_content:content,
            create_timestamp:"right now",
            comment_id: id
        });
        addComments([...comments]);
    }
    async function deleteComment(comment){
        //console.log(comments,comment);
        for(var i=0; i< comments.length;i++){
            if(comments[i].comment_id == comment.comment_id){
                
                console.log(i,comments[i].comment_content);
                comments.splice(i,1);
                addComments([...comments]);
                return;
            }
        }
    }
    const btnRef = React.useRef();
    return (
        <Box w = "300px">
            <Image alt= "BIG MEME"  key = {index}src={configs.images.location+img.image_id+"."+img.image_type}/>
            <Flex direction="row">
                <Button p = "20px"variant="ghost" h = "30px" flex={1} onClick={()=>{img.liked=!img.liked;}}>
                    <ion-icon size="large" name="happy-outline" ></ion-icon>
                </Button>
                <Button p = "20px"variant="ghost" h = "30px"  flex={1} 
                    onClick={()=>{
                        openComment(!comment);
                        if(comments.length==0){
                            getComments(img)
                        }
                    }}>
                    <ion-icon size="large" name="chatbubbles-outline" ></ion-icon>
                </Button>
            </Flex>
            {comment?
                <Stack>
                    {comments.map((comment,index)=>{
                        return(
                        <Flex align="center" justify="space-between" direction = "row" key = {index}>
                            <Box flex={1} justifyContent="center">
                                <Avatar   size="sm" name="Segun Adebayo" src="https://i.pravatar.cc/300" />{" "}
                            </Box>
                            <Text flex={9}>
                                {comment.comment_content}
                            </Text>
                            <IconButton
                                onClick={()=>{deleteComment(comment)}}
                                aria-label="Delete"
                                icon={<DeleteIcon/>}
                                />
                        </Flex>
                    )})}
                    <Box>
                        <Input type = "text" id = {"comment"+img.image_id}/>
                        <Button onClick={()=>{
                            let text = document.getElementById("comment"+img.image_id);
                            addComment(img,text.value);
                            text.value="";}}>Submit</Button>
                    </Box>
                </Stack>
                :
                null
            }
        </Box>
    )
}
export default Post;
