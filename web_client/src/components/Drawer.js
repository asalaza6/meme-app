
import React,{useState} from "react";
import { Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Link as Link2} from 'react-router-dom';
import configs from '../config';
import {Avatar,Text,Box, Flex, Button, Input } from "@chakra-ui/react";
import { Drawer, DrawerOverlay,DrawerFooter, DrawerBody,DrawerCloseButton,DrawerHeader,DrawerContent, Heading, IconButton,  useDisclosure } from "@chakra-ui/react";
import {HamburgerIcon} from "@chakra-ui/icons";
const SideMenu = ({heading,username})=>{
    const [users, setUsers] = useState([]);
    async function searchUsers(searchText){
        if(!searchText){
            setUsers([]);
            return;
        }
        try{
            const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard/searchusers`,{
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
                    alignSelf="flex-en"d
                    icon={<HamburgerIcon/>}
                    ref={btnRef}
                    onClick={onOpen}
                />
                <Heading flexGrow={1}  textAlign="center" >
                    {heading}
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
                        <Link  to="/">
                            <Button variant="ghost" w = "100%" textAlign="left">Your Feed</Button>
                        </Link>
                        <Link  to="/popular">
                            <Button variant="ghost" w = "100%" textAlign="left">Popular</Button>
                        </Link>
                        <Link  to="/rankings">
                            <Button variant="ghost" w = "100%" textAlign="left">Champion Rankings</Button>
                        </Link>
                        <Link  to={"/"+username}>
                            <Button variant="ghost" w = "100%" textAlign="left">Profile</Button>
                        </Link>
                        <Link  to="/upload">
                            <Button variant="ghost" w = "100%" textAlign="left">Upload A New Meme</Button>
                        </Link>
                        
                        <Link  to="/contests">
                            <Button variant="ghost" w = "100%" textAlign="left">Contests</Button>
                        </Link>
                        <Box h="20px"></Box>
                        <Input placeholder="Search Users" onChange={(evt)=>{searchUsers(evt.target.value)}}/>
                        {users.map((user,index)=>{
                            return (
                            <Link2 key = {index} to ={"/"+user.user_name}>
                                <Button >
                                <Box flex={1} justifyContent="center">
                                        <Avatar size="sm" name="Segun Adebayo" src="https://i.pravatar.cc/300" />{" "}
                                    </Box>
                                    <Text m ="2px" flex={9}>
                                        {user.user_name}
                                    </Text>
                                </Button>
                            </Link2>)
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
