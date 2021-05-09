import React, {useState, useEffect}  from 'react';
import {Box, Avatar,Flex, Text} from "@chakra-ui/react";
import SideMenu from './Drawer'
import configs from '../config';
import {Link } from 'react-router-dom';
const Rankings = ()=>{
    const [champions, setChampions] = useState([]);
    
    async function getChampions(){
        // let images = [];
        try{
            const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard/champions`,{
                method: "GET",
                headers:{
                    token: localStorage.token
                }
            });
            const parseRes = await response.json();
            //console.log(parseRes);
            for(var i = 0;i<parseRes.rows.length;i++){
                //will add to database later
                champions.push(parseRes.rows[i]);
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
                        <Link style = {{textDecoration:'none'}} to ={"/"+champion.user_name}>
                            <Flex shadow="inner" align="center"  fontFamily = "mono" borderRadius="10px" p = "30px" m = "10px"  direction = "row">
                                <Text m = "20px" fontSize="xx-large" color={index == 0 ? "gold":index == 1 ?"silver":index == 2 ?"brown":"black"} fontWeight="800">{index + 1}</Text>
                                <Avatar  size="xl" src={configs.images.profileLocation+champion.user_name+".jpeg"} />
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