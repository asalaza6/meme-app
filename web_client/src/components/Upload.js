import React, {useState} from 'react';
import configs from '../config';

import {Box, Flex, Button, Input, FormLabel } from "@chakra-ui/react";
import { Image, Stack} from "@chakra-ui/react";
import SideMenu from './Drawer';
const Upload = ()=>{
    const [file,setFile] = useState(null);
    const [preview,setPreview] = useState(null);

    function onChange(evt){
        let reader = new FileReader();
        
        let file = evt.target.files[0];
        setFile(file);
        //console.log(file)
        reader.addEventListener("loadend", function () {
            // convert image file to base64 string
            setPreview(reader.result);
            }, false);
        if(file){
            reader.readAsDataURL(file);
        }
    }
    async function handleSubmit(){
        if(file === null){
            alert('file not chosen');
            return;
        }
        let body = {
            name:file.name,
            content:preview
        }
        //console.log(body);
        try{
            const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard/upload`,{
                method: "POST",
                headers:{
                    token: localStorage.token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body)
            });
            const parseRes = await response.json();
            //console.log(parseRes);
            alert('image successfully uploaded');
        }catch(err){
            console.log(err.message);
        }
    }
    
    const inputRef = React.useRef();
    return (
        <Flex direction="column" align="center">
            <SideMenu heading = "Upload"/>
            <Stack maxW="700px">
                <FormLabel>Upload Your Meme</FormLabel>
                <Input onInput={onChange} accept="image/png, image/jpeg" type="file" ref={inputRef}/>
                <Image alt="preview" id="preview" src={preview}/>
                <Button p = "10px" onClick={handleSubmit}>Submit</Button>
            </Stack>
        </Flex>
    )
}
export default Upload;

