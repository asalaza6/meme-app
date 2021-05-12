import React, {useState,useEffect} from 'react';
import configs from '../config';
import {Flex, Stack, Button, Text,Box} from "@chakra-ui/react";
import Post from './Post';
import {Link} from 'react-router-dom';
const Home = (props)=>{
    
    //test function for getting comments
    const [images, setImages] = useState([]);
    const [imagesLeft,updateImagesLeft] = useState(0);
    //will replace above function with database working fetch
    
    var locked = false;
    async function getImages(){
        // let images = [];
        try{
            const length = images.length;
            const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard/popularimages`,{
                method: "GET",
                headers:{
                    token: localStorage.token,
                    count: length,
                    user_name: props.username
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
            //console.log(left,parseRes,images.length);
            updateImagesLeft(left);
            if(left<=0 ){
                //console.log(imagesLeft);
                window.removeEventListener('scroll',scroll);
            }
            // console.log("inside");
        }catch(err){
            console.log(err.message);
        }
        
    }  
    async function scroll(e){
        if(locked){
            return
        }
        locked=true;
        var totalHeight =  e.target.scrollingElement.scrollHeight;
        var top =    e.target.scrollingElement.scrollTop;
        var height = e.target.scrollingElement.clientHeight
        if(top>3*(totalHeight-height)/4){
            await getImages();
            
            // console.log("retrieving");
        }
        locked=false;
    }
    useEffect(()=>{
        getImages()
        window.addEventListener('scroll',scroll);
    },[]);
    return(
        <Flex w="100vw" minH="100vh" display = "flex" align="center" justifyContent="center" flexDirection="column">
            <Flex w="100%" p = "10px" direction = "row">
                <Box flexGrow={1}>
                    <Text fontSize="35px"  fontFamily="heading"  >
                        Meme Champion
                    </Text>
                    <Text fontSize="15px"  fontFamily="heading"  >
                        Meme it 2 win it!
                    </Text>
                </Box>
                <Flex align="center" direction = "column" >
                    <Link  to="/login">
                        <Button w="100%" m ="5px" variant="ghost" color="green">Login</Button>
                    </Link>
                    <Link  to="/register">
                        <Button m ="5px" variant="ghost" color="blue">Register</Button>
                    </Link>
                </Flex>
            </Flex>
            <Stack m="20px" maxW="90%" justify="center" align="center">
                {images.map((img,index)=>{return( 
                   <Post offline = {true} img={img} key={index}/>
                )})}
                {imagesLeft>0?<Button
                    onClick={()=>{
                        getImages();
                    }}
                >More images</Button>:null}
            </Stack>
        </Flex>
    )
}
export default Home;

