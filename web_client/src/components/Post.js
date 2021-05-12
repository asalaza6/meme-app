
import React from "react";
import configs from '../config';
import {connect} from 'react-redux';
import {Box,Input,  Flex, Button, Image } from "@chakra-ui/react";
import { Avatar, Text, IconButton} from "@chakra-ui/react";
import {DeleteIcon, ChatIcon, StarIcon, HamburgerIcon, CloseIcon, SmallCloseIcon, CheckIcon} from "@chakra-ui/icons";
import {Link } from 'react-router-dom';

class Post extends React.Component {//({img,index})=>
    constructor(props){
        super(props);
        this.state = {
            comment:false,
            comments:[],
            commentsLeft:0,
            liked:false,
            image_id: null,
            image_type: null,
            number_likes: 0,
            menuOpen:false,
            deleteConfirm:false,
            offline: false
        }
        //console.log(props);
        this.getComments = this.getComments.bind(this);
        this.checkLike = this.checkLike.bind(this);
        this.checkLikeOffline = this.checkLikeOffline.bind(this);
        this.likeImage = this.likeImage.bind(this);
        this.addComment = this.addComment.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
        this.deletePost = this.deletePost.bind(this);
    }
    async deletePost(){
        try{
            const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard/deletepost`,{
                method: "GET",
                headers:{
                    token: localStorage.token,
                    image:this.state.image_id,
                    user:this.props.user_name
                }
            });
            const parseRes = await response.json();
            window.location.reload(false);
            //console.log(parseRes);
        }catch(err){
            console.log(err.message);
        }
    }

    async getComments(){
        
        try{
            const length = this.state.comments.length;
            const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard/comments`,{
                method: "GET",
                headers:{
                    token: localStorage.token,
                    image:this.state.image_id,
                    count: length
                }
            });
            const parseRes = await response.json();
            // console.log(parseRes);
            for(let i = 0; i < parseRes.comments.rows.length;i++){
                this.state.comments.push(parseRes.comments.rows[i]);
            }
            this.setState({comments:this.state.comments});
            var left = parseRes.count.rows[0].count-this.state.comments.length;
            //console.log(left);
            this.setState({commentsLeft:left});
            //console.log(img.comments);
        }catch(err){
            console.log(err.message);
        }
        
    }
    
    async checkLike(){
        try{
            const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard/likeimage`,{
                method: "GET",
                headers:{
                    token: localStorage.token,
                    image: this.props.img.image_id,
                    user: this.props.username
                }
            });
            const parseRes = await response.json();
            this.setState({
                liked:parseRes.liked,
                number_likes:parseInt(parseRes.number_likes)
            });
            
           // console.log("checking img",img.image_id,parseRes);
            //console.log(img.comments);
        }catch(err){

        }
          
    }
    async checkLikeOffline(){
        // console.log('offline lik')
        try{
            const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard/offlinelike`,{
                method: "GET",
                headers:{
                    image: this.props.img.image_id
                }
            });
            const parseRes = await response.json();
            // console.log(parseRes);
            this.setState({
                number_likes:parseInt(parseRes.number_likes)
            });
            
           // console.log("checking img",img.image_id,parseRes);
            //console.log(img.comments);
        }catch(err){

        }
          
    }
    async likeImage(){

        let body = {
            image: this.state.image_id,
            liked: this.state.liked,
            user: this.props.username
        }
        //console.log("first",this.state);

        try{
            const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard/likeimage`,{
                method: "POST",
                headers:{
                    token: localStorage.token,
                    "Content-Type": "application/json",
                },
                body:JSON.stringify(body)
            });
            const parseRes = await response.json();
            //console.log("end",parseRes);
            this.setState({liked:parseRes,number_likes:parseRes?this.state.number_likes+1:this.state.number_likes-1});
            //this.setState({})
            //console.log(this.state.comments);
        }catch(err){

        }
          
    }
    
    async addComment(content){
        if(content === ""){
            return;
        }
        let body = {
            image: this.state.image_id,
            content: content
        }
        //console.log(body);
        try{
            const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard/comments`,{
                method: "POST",
                headers:{
                    token: localStorage.token,
                    "Content-Type": "application/json",
                },
                body:JSON.stringify(body)
            });
            const parseRes = await response.json();
           // console.log("parse",parseRes);
            var id = parseRes[0].comment_id;
            
        }catch(err){
            console.log(err.message);
        }

        this.state.comments.unshift({
            comment_content:content,
            create_timestamp:"right now",
            comment_id: id,
            user_name:this.props.username
        });
        this.setState({comments:this.state.comments});
    }
    async deleteComment(comment){
        //console.log(comments,comment);
        //remove off memory
        for(var i=0; i< this.state.comments.length;i++){
            if(this.state.comments[i].comment_id === comment.comment_id){
                
                //console.log(i,this.state.comments[i].comment_content);
                this.state.comments.splice(i,1);
                this.setState({comments:this.state.comments});
                break;
            }
        }
        //console.log(comment);
        //remove off server
        let {comment_id} = comment;
        let body = {
            comment: comment_id,
        }
        try{
            const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard/deletecomment`,{
                method: "POST",
                headers:{
                    token: localStorage.token,
                    "Content-Type": "application/json",
                },
                body:JSON.stringify(body)
            });
            const parseRes = await response.json();
            //console.log("parse",parseRes);
            //var id = parseRes[0].comment_id;
            
        }catch(err){
            console.log(err.message);
        }
    }
    componentDidUpdate(){
        //console.log("updating",this.props,this.props.key);
        if(this.props.img.image_id !== this.state.image_id){
            //console.log("updating props", this.props,this.props.img,this.state.image_id);
            this.setState({
                image_id:this.props.img.image_id,
                image_type: this.props.img.image_type,
                number_likes: 0
            });
            this.checkLike();
        }
    }
    componentDidMount(){
        //
        this.setState({
            image_id:this.props.img.image_id,
            image_type: this.props.img.image_type,
            image_user: this.props.img.user_name,
            number_likes: 0,
            offline: this.props.offline
        });
        // console.log(this.props);
        //console.log(this.state);
       // console.log("update img");
       if(!this.props.offline){
            this.checkLike();
       }else{
           this.checkLikeOffline();
       }

    }
    render(){
    return (
        <Box boxShadow = "2xl" borderRadius="20px" overflow="hidden" w = "100%" >
            <Flex justify="space-between" bg="white" p = "15px" direction="row">
                <Link style = {{textDecoration:'none'}} to ={this.props.offline?"#":"/"+this.state.image_user}>
                    <Flex dir="row">
                        <Avatar  size="md" src={configs.images.profileLocation+this.state.image_user+".jpeg"} />
                        <Text marginLeft="10px" fontWeight="600" wrap="wrap" fontSize="x-large">{this.state.image_user}</Text>
                    </Flex>
                </Link>
                {this.state.image_user===this.props.username?<Box position ="relative">
                    <IconButton 
                        icon = {<HamburgerIcon/>}
                        onClick={()=>{this.setState({menuOpen:true})}}/>
                    {this.state.menuOpen?<Box position ="absolute" top="0" right="0">
                        <Box bg = "white" >
                            {
                                this.state.deleteConfirm?
                                <Flex direction ="row">
                                     <IconButton 
                                        icon = {<CheckIcon/>}
                                        color= "green"
                                        onClick={()=>{this.deletePost()}}/>
                                     <IconButton 
                                        icon = {<CloseIcon/>}
                                        color = "red"
                                        onClick={()=>{this.setState({deleteConfirm:false})}}/>
                                </Flex>:
                                <Box>
                                <IconButton 
                                icon = {<DeleteIcon/>}
                                onClick={()=>{this.setState({deleteConfirm:true})}}/>
                                <IconButton 
                                icon = {<SmallCloseIcon/>}
                                onClick={()=>{this.setState({menuOpen:false})}}/>
                                </Box>
                            }
                            
                        </Box>
                    </Box>:null}
                </Box>:null}
                
            </Flex>
            <Image w = "100%" alt= "BIG MEME"  key = {this.props.index}src={configs.images.postLocation+this.state.image_id+"."+this.state.image_type}/>
            <Flex bg = "white" direction="row">
                <IconButton
                    p = "20px" variant="ghost" h = "30px"  flex={1}
                    aria-label="Like"
                    icon={<Flex align="center"><Text marginRight ="6px">{this.state.number_likes}</Text><StarIcon/></Flex>}
                    onClick={()=>{if(this.props.offline){alert("Make an account to unlock this feature!");return;}else{this.likeImage();}}}
                    color={this.state.liked?"green.400":"red.400"}
                    />
                <IconButton
                    p = "20px"variant="ghost" h = "30px"  flex={1}
                    aria-label="Chat"
                    color="blue.400"
                    icon={<ChatIcon/>}
                    onClick={()=>{
                        this.setState({comment:!this.state.comment});
                        if(this.state.comments.length===0){
                            this.getComments()
                        }
                    }}
                    />
            </Flex>
            {this.state.comment?
                <Flex bg = "white" direction="column-reverse">
                    <Flex  m = "10px" direction="row" alignItems="center" >
                        <Input type = "text" marginRight="5px" id = {"comment"+this.state.image_id}/>
                        <Button onClick={()=>{
                            if(this.props.offline){alert("Make an account to unlock this feature!");return;}
                            else{
                            let text = document.getElementById("comment"+this.state.image_id);
                            this.addComment(text.value);
                            text.value="";}}}>Submit</Button>
                    </Flex>
                    {this.state.comments.map((comment,index)=>{
                        return(
                        <Flex w = "96%" margin = "2%" align="center" justify="space-between" direction = "row" key = {index}>
                            
                            <Flex m = "2px" direction = "column" flex={1} justifyContent="center" alignItems="center">
                                <Link key = {index} to ={this.props.offline?"#":"/"+comment.user_name}>
                                        <Avatar  flex={4} alignSelf="center" size="md" src={configs.images.profileLocation+comment.user_name+".jpeg"} />
                                </Link>
                            </Flex>
                            <Flex w="20%" m = "2px" flexShrink = {1} direction = "column"  flex={9}  >
                                <Text fontWeight="600" fontSize="s">
                                    {comment.user_name}
                                </Text>
                                <Text overflowWrap="revert"  flexWrap="wrap"  fontSize="s"   >
                                    {comment.comment_content}
                                </Text>
                            </Flex>
                            {this.props.username === comment.user_name?
                            <IconButton
                                onClick={()=>{this.deleteComment(comment)}}
                                aria-label="Delete"
                                icon={<DeleteIcon/>}
                                />:null}
                        </Flex>
                    )})}
                    {this.state.commentsLeft!== 0?
                    <Button variant="link" onClick={()=>{
                        this.getComments();
                    }}>Show more comments</Button>:null}
                </Flex>
                :
                null
            }
        </Box>
    )}
}

const mapStateToProps = state => ({
    username: state.user.username
})
export default connect(mapStateToProps,null)(Post);

// import React, {  useEffect, useState } from "react";
// import configs from '../config';
// import {Box,Input,  Flex, Button, Image } from "@chakra-ui/react";
// import { Avatar, Text, IconButton, Stack} from "@chakra-ui/react";
// import {DeleteIcon, ChatIcon, CheckIcon} from "@chakra-ui/icons";
// class Post extends React.Component {//({img,index})=>
//     constructor(props){
//         super();
//         this.state = {
//             comment:false,
//             comments:[],
//             commentsLeft:0,
//             liked:false,
//             img:props.img
//         }
//         this.getComments = this.getComments.bind(this);
//         this.checkLike = this.checkLike.bind(this);
//         this.likeImage = this.likeImage.bind(this);
//         this.addComment = this.addComment.bind(this);
//         this.deleteComment = this.deleteComment.bind(this);
//     }

//     async getComments(img){
        
//         try{
//             const length = this.state.comments.length;
//             const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard/comments`,{
//                 method: "GET",
//                 headers:{
//                     token: localStorage.token,
//                     image:img.image_id,
//                     count: length
//                 }
//             });
//             const parseRes = await response.json();
//             // console.log(parseRes);
//             for(let i = 0; i < parseRes.comments.rows.length;i++){
//                 this.state.comments.push(parseRes.comments.rows[i]);
//             }
//             this.setState({comments:this.state.comments});
//             var left = parseRes.count.rows[0].count-this.state.comments.length;
//             //console.log(left);
//             this.setState({commentsLeft:left});
//             //console.log(img.comments);
//         }catch(err){
//             console.log(err.message);
//         }
        
//     }
//     async checkLike(img){
//         try{
//             const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard/likeimage`,{
//                 method: "GET",
//                 headers:{
//                     token: localStorage.token,
//                     image: img.image_id,
//                     user: localStorage.user
//                 }
//             });
//             const parseRes = await response.json();
//             //console.log(parseRes);
//             this.setState({liked:parseRes});
            
//            // console.log("checking img",img.image_id,parseRes);
//             //console.log(img.comments);
//         }catch(err){

//         }
          
//     }
//     async likeImage(img){
//         let body = {
//             image: img.image_id,
//             liked: this.state.liked,
//             user: localStorage.user
//         }
//         try{
//             const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard/likeimage`,{
//                 method: "POST",
//                 headers:{
//                     token: localStorage.token,
//                     "Content-Type": "application/json",
//                 },
//                 body:JSON.stringify(body)
//             });
//             const parseRes = await response.json();
//             //console.log(parseRes);
//             this.setState({liked:parseRes});
//             //console.log(img.comments);
//         }catch(err){

//         }
          
//     }
//     async addComment(img,content){
//         let body = {
//             image: img.image_id,
//             content: content
//         }
//         //console.log(body);
//         try{
//             const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard/comments`,{
//                 method: "POST",
//                 headers:{
//                     token: localStorage.token,
//                     "Content-Type": "application/json",
//                 },
//                 body:JSON.stringify(body)
//             });
//             const parseRes = await response.json();
//            // console.log("parse",parseRes);
//             var id = parseRes[0].comment_id;
            
//         }catch(err){
//             console.log(err.message);
//         }

//         this.state.comments.unshift({
//             comment_content:content,
//             create_timestamp:"right now",
//             comment_id: id,
//             user_id:localStorage.user
//         });
//         this.setState({comments:this.state.comments});
//     }
//     async deleteComment(comment){
//         //console.log(comments,comment);
//         //remove off memory
//         for(var i=0; i< this.state.comments.length;i++){
//             if(this.state.comments[i].comment_id === comment.comment_id){
                
//                 //console.log(i,this.state.comments[i].comment_content);
//                 this.state.comments.splice(i,1);
//                 this.setState({comments:this.state.comments});
//                 break;
//             }
//         }
//         //console.log(comment);
//         //remove off server
//         let {comment_id} = comment;
//         let body = {
//             comment: comment_id,
//         }
//         try{
//             const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard/deletecomment`,{
//                 method: "POST",
//                 headers:{
//                     token: localStorage.token,
//                     "Content-Type": "application/json",
//                 },
//                 body:JSON.stringify(body)
//             });
//             const parseRes = await response.json();
//             //console.log("parse",parseRes);
//             //var id = parseRes[0].comment_id;
            
//         }catch(err){
//             console.log(err.message);
//         }
//     }
//     componentDidUpdate(){
//         if(this.props.img != this.state.img){
//             //console.log("updating img state",this.props.img);
//             this.setState({img:this.props.img});
//             this.checkLike(this.props.img);
//         }
//     }
//     componentDidMount(){
//         this.setState({img:this.props.img});
        
//        // console.log("update img");
//         this.checkLike(this.state.img);

//     }
//     render(){
//     return (
//         <Box w = "300px">
//             <Image alt= "BIG MEME"  key = {this.props.index}src={configs.images.location+this.state.img.image_id+"."+this.state.img.image_type}/>
//             <Flex direction="row">
//             <IconButton
//                 p = "20px"variant="ghost" h = "30px"  flex={1}
//                     aria-label="Like"
//                     icon={<CheckIcon/>}
//                     onClick={()=>{this.likeImage(this.state.img);}}
//                     color={this.state.liked?"green.400":"red.400"}
//                     />
//                 <IconButton
//                 p = "20px"variant="ghost" h = "30px"  flex={1}
//                     aria-label="Chat"
//                     color="blue.400"
//                     icon={<ChatIcon/>}
//                     onClick={()=>{
//                         this.setState({comment:!this.state.comment});
//                         if(this.state.comments.length===0){
//                             this.getComments(this.state.img)
//                         }
//                     }}
//                     />
//             </Flex>
//             {this.state.comment?
//                 <Stack direction="column-reverse">
//                     <Flex direction="row">
//                         <Input type = "text" id = {"comment"+this.state.img.image_id}/>
//                         <Button onClick={()=>{
//                             let text = document.getElementById("comment"+this.state.img.image_id);
//                             this.addComment(this.state.img,text.value);
//                             text.value="";}}>Submit</Button>
//                     </Flex>
//                     {this.state.comments.map((comment,index)=>{
//                         return(
//                         <Flex align="center" justify="space-between" direction = "row" key = {index}>
//                             <Box flex={1} justifyContent="center">
//                                 <Avatar   size="sm" name="Segun Adebayo" src="https://i.pravatar.cc/300" />{" "}
//                             </Box>
//                             <Text flex={9}>
//                                 {comment.comment_content}
//                             </Text>
//                             {localStorage.user === comment.user_id?
//                             <IconButton
//                                 onClick={()=>{this.deleteComment(comment)}}
//                                 aria-label="Delete"
//                                 icon={<DeleteIcon/>}
//                                 />:null}
//                         </Flex>
//                     )})}
//                     {this.state.commentsLeft!== 0?
//                     <Button variant="link" onClick={()=>{
//                         this.getComments(this.state.img);
//                     }}>Show more comments</Button>:null}
//                 </Stack>
//                 :
//                 null
//             }
//         </Box>
//     )}
// }
// export default Post;
