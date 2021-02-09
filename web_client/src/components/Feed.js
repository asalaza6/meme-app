import React, {useState,useEffect} from 'react';
import configs from '../config';
import {Image,Box, Button, Drawer, Flex, Stack} from "@chakra-ui/react";
import SideMenu from './Drawer';
import Post from './Post';
const Feed = ()=>{
    //test function for getting comments
    const [images, setImages] = useState([]);
    const [comments, openComments] = useState(false);
    
    //will replace above function with database working fetch
    async function getImages(){
        let images = [];
        try{
            const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard/images`,{
                method: "GET",
                headers:{
                    token: localStorage.token
                }
            });
            const parseRes = await response.json();
            //console.log(parseRes);
            for(var i = 0;i<parseRes.rows.length;i++){
                //temporary for liking
                parseRes.rows[i].liked = false;
                parseRes.rows[i].comment = false;
                parseRes.rows[i].comments = [];
                //will add to database later
                images.push(parseRes.rows[i]);
            }
            
        }catch(err){
            console.log(err.message);
        }
        setImages(images);

    }  
    useEffect(()=>{
        getImages();
    },[]);
    return(
        <Box display = "flex" align="center" justifyContent="space-between" flexDirection="column">
            <SideMenu heading="Your Feed"/>
            
            <Stack justify="center" align="center">
                {images.map((img,index)=>{return( 
                   <Post img={img} key={index}/>
                )})}
            </Stack>
        </Box>
    )
}
export default Feed;