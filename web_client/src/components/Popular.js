import React from 'react';
import {Box, Text} from "@chakra-ui/react";
import SideMenu from './Drawer';
const Popular = ()=>{
    
    return(
        <Box display = "flex" align="center" justifyContent="space-between" flexDirection="column">
            <SideMenu heading="What's Popular?"/>
            
            <Text>
                Coming Soon
            </Text>
        </Box>
    )
}
export default Popular;