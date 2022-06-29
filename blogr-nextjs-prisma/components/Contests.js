import React from 'react';
import {Box, Text} from "@chakra-ui/react";
import SideMenu from './Drawer';
const Contests = ()=>{
    
    return(
        <Box display = "flex" align="center" justifyContent="space-between" flexDirection="column">
            <SideMenu heading="Upcoming Contests"/>
            
            <Text>
                Coming Soon
            </Text>
        </Box>
    )
}
export default Contests;