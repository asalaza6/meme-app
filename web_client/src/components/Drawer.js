
import React, { Fragment, useState } from "react";
import { Link} from 'react-router-dom';

import {Box, Flex, Button, Input } from "@chakra-ui/react";
import { Drawer, DrawerOverlay,DrawerFooter, DrawerBody,DrawerCloseButton,DrawerHeader,DrawerContent, Heading, IconButton, Stack, useDisclosure } from "@chakra-ui/react";
import {HamburgerIcon} from "@chakra-ui/icons";
const SideMenu = ({heading})=>{
    
    const {isOpen, onOpen, onClose} = useDisclosure();
    const btnRef = React.useRef();
    return (
        <Box>
            <Flex p ="30px" w="100vw" direction="row" justify="center" >
                    <IconButton
                        flex={1}
                        size="lg"
                        alignSelf="flex-end"
                        icon={<HamburgerIcon/>}
                        ref={btnRef}
                        onClick={onOpen}
                    />
                    <Heading flex={20} textAlign="center" >{heading}</Heading>
                    
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
                            <Link  to="/">
                                <Button variant="ghost" w = "100%" textAlign="left">Popular</Button>
                            </Link>
                            <Link  to="/">
                                <Button variant="ghost" w = "100%" textAlign="left">Champion Rankings</Button>
                            </Link>
                            <Link  to="/dashboard">
                                <Button variant="ghost" w = "100%" textAlign="left">Profile</Button>
                            </Link>
                            <Link  to="/upload">
                                <Button variant="ghost" w = "100%" textAlign="left">Upload A New Meme</Button>
                            </Link>
                            
                            <Link  to="/">
                                <Button variant="ghost" w = "100%" textAlign="left">Contests</Button>
                            </Link>
                            <Box h="20px"></Box>
                            <Input placeholder="Search Users" />
                        </DrawerBody>

                        <DrawerFooter>
                        <Button variant="outline" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button color="blue">Save</Button>
                        </DrawerFooter>
                    </DrawerContent>
                    </DrawerOverlay>
                </Drawer>
            </Box>
    )
}
export default SideMenu;
