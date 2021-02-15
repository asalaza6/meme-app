import React from 'react';
import { Link} from 'react-router-dom';
import {Box,Flex, Heading, Image, Button, AspectRatio } from "@chakra-ui/react";

export default ()=>{
    const background = "red.100";
    const bgGradient = "linear(blue.100 0%, purple.100 25%, red.100 50%)";
    return(
        <Flex align="center"  bg={background} minH="100vh" direction="column">
            <Box 
                w = "100vw"
                bgGradient={bgGradient}
                h ="100px"/>
            <Box maxW="700px"align="center"p ="50px" direction="column">
                <Heading p="20px" color="black">Meme Champion: Join the Fun!</Heading>
                <AspectRatio  ratio={4/3}>
                    <Image alt = "home" src = "https://i.ytimg.com/vi/UZtgutRejUM/maxresdefault.jpg"></Image>
                </AspectRatio>
                <Flex direction ="column" m ="10px" p = "10px">
                    <Link border="1pt black solid" to="/login">
                        <Button   w = "100%"textAlign="left">Login</Button>
                    </Link>
                    <Box h="10px"></Box>
                    <Link  to="/register">
                        <Button w = "100%" textAlign="left">Register</Button>
                    </Link>
                </Flex>
            </Box>
        </Flex>
    )
}
