import React, {useState,useEffect} from 'react';
import configs from '../config';
import {Flex, Stack, Button} from "@chakra-ui/react";
import SideMenu from './Drawer';
import Post from './Post';
import {connect} from 'react-redux';

const Popular = (props)=>{
    
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
        <Flex  display = "flex" align="center" justifyContent="center" flexDirection="column">
            <SideMenu heading="Your Popular"/>
            
            <Stack m="20px" maxW="90%" w="500px"justify="center" align="center">
                {images.map((img,index)=>{return( 
                   <Post img={img} key={index}/>
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
const mapStateToProps = state => ({
    username: state.user.username
})
export default connect(mapStateToProps,null)(Popular);

