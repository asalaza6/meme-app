import React, { useState } from "react";
import {Flex, Button,Text, Box,} from '@chakra-ui/react';
import PropTypes from 'prop-types';

const EmojiPicker = ({onEmojiClick})=>{
    const emojis = [
        '😂',
        '😎',
        '🙏',
        '😭',
        '👊',
        '🙏🏻',
        '👌🏼',
        '🙏🏾',
        '🐰',
        '😟',
        '😁',
        '🤐',
        '😯'
    ];
    const handleEmojiClick = (index) =>{
        onEmojiClick(emojis[index]);
    }
    return (
        <Flex paddingX ="10px" dir = "row" flexWrap="wrap" >
            {
                emojis.map((emoji,index)=>{return( 
                    <Button size="md" variant = "ghost" onClick={()=>{handleEmojiClick(index)}} key={index}>{emoji}</Button>
                 )})
            }
        </Flex>
    )
}


export default EmojiPicker;
EmojiPicker.propTypes = {
    onEmojiClick: PropTypes.func
}
