import React from 'react';
import {Box, Text} from "@chakra-ui/react";
import SideMenu from './Drawer';
const Rankings = ()=>{
    
    return(
        <Box display = "flex" align="center" justifyContent="space-between" flexDirection="column">
            <SideMenu heading="Meme Champion Rankings"/>
            
            <Text>
                Coming Soon
            </Text>
        </Box>
    )
}
export default Rankings;