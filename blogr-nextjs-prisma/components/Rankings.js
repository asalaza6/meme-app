import React, {useState, useEffect}  from 'react';
import {Box, Avatar,Flex, Text} from "@chakra-ui/react";
import SideMenu from './Drawer'
import configs from '../config';
import Link from 'next/link';
const Rankings = ()=>{
    const [champions, setChampions] = useState([]);
    
    async function getChampions(){
        // let images = [];
        try{
            const response = await fetch(`/api/champions`,{
                method: "GET",
                headers:{
                    token: localStorage.token
                }
            });
            const parseRes = await response.json();
            // console.log(parseRes);
            for(var i = 0;i<parseRes.length;i++){
                //will add to database later
                champions.push(parseRes[i]);
            }
            
            setChampions([...champions]);            
        }catch(err){
            console.log(err.message);
        }
        
    } 
    useEffect(()=>{
        getChampions()
    },[]);
    return(
        <Box  align="center" justify="center" >
            <SideMenu heading="Meme Champion Rankings"/>
            
            <Box maxW = "900px" direction="column">
                {champions.map((champion,index)=>{
                    return(
                        <Link key = {index} style = {{textDecoration:'none'}} href={"/"+champion.user_name}>
                            <Flex shadow="inner" align="center"  fontFamily = "mono" borderRadius="10px" p = "30px" m = "10px"  direction = "row">
                                <Text m = "20px" fontSize="xx-large" color={index === 0 ? "gold":index === 1 ?"silver":index === 2 ?"brown":"black"} fontWeight="800">{index + 1}</Text>
                                <Avatar  size="xl" src={champion.user_image ? champion.user_image: null} />
                                <Text m = "20px" fontFamily="cursive" fontSize="large" >{champion.user_name}</Text>
                            </Flex>
                        </Link>
                    )
                })}
            </Box>
        </Box>
    )
}
export default Rankings;