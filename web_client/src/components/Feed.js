import React, {useState,useEffect} from 'react';
import configs from '../config';
import {Box, Stack, Button} from "@chakra-ui/react";
import SideMenu from './Drawer';
import Post from './Post';
const Feed = ()=>{
    //test function for getting comments
    const [images, setImages] = useState([]);
    const [imagesLeft,updateImagesLeft] = useState(0);
    
    //will replace above function with database working fetch
    async function getImages(){
        // let images = [];
        try{
            const length = images.length;
            const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard/images`,{
                method: "GET",
                headers:{
                    token: localStorage.token,
                    count: length
                }
            });
            const parseRes = await response.json();
            // console.log(parseRes);
            for(var i = 0;i<parseRes.images.rows.length;i++){
                //will add to database later
                images.push(parseRes.images.rows[i]);
            }
            
            setImages([...images]);
            var left = parseRes.count.rows[0].count-images.length;
            updateImagesLeft(left);
        }catch(err){
            console.log(err.message);
        }
        
    }  
    async function scroll(e){
        var totalHeight =  e.target.scrollingElement.scrollHeight;
        var top =    e.target.scrollingElement.scrollTop;
        var height = e.target.scrollingElement.clientHeight
        if(top>(totalHeight-height)/2){
            getImages();
            if(imagesLeft==0){
                window.removeEventListener('scroll',scroll);
            }
            // console.log(totalHeight, top, height);
        }
    
    }
    useEffect(()=>{
        getImages();
        window.addEventListener('scroll',scroll);
    },[]);
    return(
        <Box display = "flex" align="center" justifyContent="space-between" flexDirection="column">
            <SideMenu heading="Your Feed"/>
            
            <Stack justify="center" align="center">
                {images.map((img,index)=>{return( 
                   <Post img={img} key={index}/>
                )})}
                {imagesLeft>0?<Button
                    onClick={()=>{
                        getImages();
                    }}
                >More images</Button>:null}
            </Stack>
        </Box>
    )
}
export default Feed;