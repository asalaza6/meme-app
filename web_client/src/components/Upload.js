import React, {useState} from 'react';
import configs from '../config';
import {toast} from 'react-toastify';
import Compress from "react-image-file-resizer";

// import compress from 'compress.js';
import {Flex, Button, Input, FormLabel } from "@chakra-ui/react";
import { Image, Stack} from "@chakra-ui/react";
import SideMenu from './Drawer';
const Upload = ()=>{
    const [file,setFile] = useState(null);
    const [preview,setPreview] = useState(null);

    function onChange(evt){
        let reader = new FileReader();
        
        let file = evt.target.files[0];

        //console.log(file);
        setFile(file);
        if(!file){
            setPreview(null);
            return;
        }
        Compress.imageFileResizer(
            file, // the file from input
            480, // width
            480, // height
            "JPEG", // compress format WEBP, JPEG, PNG
            70, // quality
            0, // rotation
            (uri) => {
                setPreview(uri);
            // You upload logic goes here
            },
            "base64" // blob or base64 default base64
        );
    }
    async function handleSubmit(){
        if(file === null){
            alert('file not chosen');
            return;
        }
        let body = {
            name:file.name,
            content:preview,
            type: "post"
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
            setPreview(null);
            setFile(null);
            toast.success("Upload successful!");

        }catch(err){
            console.log(err.message);
        }
    }
    
    const inputRef = React.useRef();
    return (
        <Flex direction="column" align="center">
            <SideMenu heading = "Upload"/>
            <Stack p="10px" maxW="700px">
                <FormLabel>Upload Your Meme</FormLabel>
                <Input onInput={onChange} accept="image/png, image/jpeg" type="file" ref={inputRef}/>
                {preview?<Image alt="preview" id="preview" src={preview}/>:null}
                <Button p = "10px" onClick={handleSubmit}>Submit</Button>
            </Stack>
        </Flex>
    )
}
export default Upload;

