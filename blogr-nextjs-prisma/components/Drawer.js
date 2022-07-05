
import React,{useState} from "react";
import Link from 'next/link';
import {connect} from 'react-redux';
import configs from '../config';
import {Avatar,Text,Box, Flex, Button, Input } from "@chakra-ui/react";
import { Drawer, DrawerOverlay,DrawerFooter, DrawerBody,DrawerCloseButton,DrawerHeader,DrawerContent, Heading, IconButton,  useDisclosure } from "@chakra-ui/react";
import {HamburgerIcon} from "@chakra-ui/icons";
const SideMenu = (props)=>{
    const [users, setUsers] = useState([]);
    async function searchUsers(searchText){
        if(!searchText){
            setUsers([]);
            return;
        }
        try{
            const response = await fetch(`/api/searchusers`,{
                method: "GET",
                headers:{
                    token: localStorage.token,
                    search: searchText
                }
            });
            const parseRes = await response.json();
            
            //console.log(parseRes);
            setUsers(parseRes);
            //console.log(parseRes);
            //setName(parseRes.user_name);
        }catch(err){
            
        }
    }
    const {isOpen, onOpen, onClose} = useDisclosure();
    const btnRef = React.useRef();
    
    return (
        <Box  w="100%">
            <Flex p = "30px" direction="row" justify="center" >
                <IconButton
                    size="lg"
                    alignSelf="flex-en"
                    icon={<HamburgerIcon/>}
                    ref={btnRef}
                    onClick={onOpen}
                />
                <Heading flexGrow={1}  textAlign="center" >
                    {props.heading}
                </Heading>
            </Flex>
            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay>
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Memechampion.com</DrawerHeader>

                    <DrawerBody>
                        <Link href="/">
                            <Button variant="ghost" w = "100%" textAlign="left">Your Feed</Button>
                        </Link>
                        <Link href="/popular">
                            <Button variant="ghost" w = "100%" textAlign="left">Popular</Button>
                        </Link>
                        <Link href="/rankings">
                            <Button variant="ghost" w = "100%" textAlign="left">Champion Rankings</Button>
                        </Link>
                        <Link href={"/"+props.username}>
                            <Button variant="ghost" w = "100%" textAlign="left">Profile</Button>
                        </Link>
                        <Link href="/upload">
                            <Button variant="ghost" w = "100%" textAlign="left">Upload A New Meme</Button>
                        </Link>
                        
                        <Link href="/contests">
                            <Button variant="ghost" w = "100%" textAlign="left">Contests</Button>
                        </Link>
                        <Box h="20px"></Box>
                        <Input placeholder="Search Users" onChange={(evt)=>{searchUsers(evt.target.value)}}/>
                        {users.map((user,index)=>{
                            return (
                            <Link key = {index} href={"/"+user.user_name}>
                                <Button >
                                <Box flex={1} justifyContent="center">
                                        <Avatar size="sm" name={user.user_name} src={user.user_image} />{" "}
                                    </Box>
                                    <Text m ="2px" flex={9}>
                                        {user.user_name}
                                    </Text>
                                </Button>
                            </Link>)
                        })}
                    </DrawerBody>

                    <DrawerFooter>
                    <Button variant="outline" mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    </DrawerFooter>
                </DrawerContent>
                </DrawerOverlay>
            </Drawer>
        </Box>
    )
}
const mapStateToProps = state => ({
    username: state.user.username
})
export default connect(mapStateToProps,null)(SideMenu);
