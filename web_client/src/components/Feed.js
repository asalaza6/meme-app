import React, {useState,useEffect} from 'react';
import configs from '../config';
import {Flex, Stack, Text} from "@chakra-ui/react";
import SideMenu from './Drawer';
import Post from './Post';
import {connect} from 'react-redux';

const Feed = (props)=>{
    
    //test function for getting comments
    const [images, setImages] = useState([]);
    //will replace above function with database working fetch
    const [newcomerMessage, setNew] = useState(false);
    var locked = false;
    async function getImages(){
        // let images = [];
        try{
            const length = images.length;
            const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard/feedimages`,{
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
            //console.log(parseRes.more);
            
            if(!parseRes.more){
                if(images.length===0){
                    setNew(true);
                }
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
    },[getImages,scroll]);
    return(
        <Flex display = "flex" align="center" justifyContent="center" flexDirection="column">
            <SideMenu heading="Your Feed"/>
            {newcomerMessage?
                <Text textAlign="center" fontSize="15pt" w="80%" m = "40px">
                    Follow other memers or upload your own meme to populate your Feed! <br/>
                    Check out the Champion Rankings for the most popular memers! <br/>
                    Check out the Popular Page to check out the hottest meme posts! <br/>
                    Use the search bar to find your friends!
                </Text>:null
            }
            <Stack m="20px" maxW="90%" w="500px"justify="center" align="center">
                {images.map((img,index)=>{return( 
                   <Post img={img} key={index}/>
                )})}
            </Stack>
        </Flex>
    )
}
const mapStateToProps = state => ({
    username: state.user.username
})
export default connect(mapStateToProps,null)(Feed);

