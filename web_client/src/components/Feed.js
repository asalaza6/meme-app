import React, {Component} from 'react';
import {Redirect, Link} from 'react-router-dom';
import {View} from 'react';
import configs from '../config';
import '../mysass.scss'
export default class Home extends Component{
    constructor(){
        super();
        this.imageCount=0;
        this.state={
            count:0,
            renderDummy:false
        };
        this.getImages = this.getImages.bind(this);
        this.addComment = this.addComment.bind(this);
        this.getComments = this.getComments.bind(this);
        this.images = [];
    }
    async componentDidMount(){
        await this.getImages();
    }
    //test function for getting comments
    async getComments(img){
        
        try{
            const response = await fetch(`http://${configs.api.url}:${configs.api.port}/dashboard/comments`,{
                method: "GET",
                headers:{
                    token: localStorage.token,
                    image:img.image_id
                }
            });
            const parseRes = await response.json();
            console.log(parseRes);
            for(let i = 0; i < parseRes.rows.length;i++){
                img.comments.push(parseRes.rows[i]);
            }
            //console.log(img.comments);
        }catch(err){
            //console.log(err.message);
        }
        
        this.setState({renderDummy:!this.state.renderDummy});
    }
    async addComment(img,content){
        let body = {
            image: img.image_id,
            content: content
        }
        console.log(body);
        try{
            const response = await fetch(`http://${configs.api.url}:${configs.api.port}/dashboard/comments`,{
                method: "POST",
                headers:{
                    token: localStorage.token,
                    "Content-Type": "application/json",
                },
                body:JSON.stringify(body)
            });
            const parseRes = await response.json();
            //console.log(parseRes);
            
        }catch(err){
            console.log(err.message);
        }
        img.comments.push({
            comment_content:content,
            create_timestamp:"right now"
        });
        this.setState({renderDummy:!this.state.renderDummy});
    }
    //will replace above function with database working fetch
    async getImages(){

        try{
            const response = await fetch(`http://${configs.api.url}:${configs.api.port}/dashboard/images`,{
                method: "GET",
                headers:{
                    token: localStorage.token,
                    count:this.imageCount
                }
            });
            const parseRes = await response.json();
            //console.log(parseRes);
            for(var i = 0;i<parseRes.rows.length-1;i++){
                //temporary for liking
                parseRes.rows[i].liked = false;
                parseRes.rows[i].comment = false;
                parseRes.rows[i].comments = [];
                //will add to database later
                this.images.push(parseRes.rows[i]);
            }
            this.setState({count:this.state.count+parseRes.rows.length});
            
        }catch(err){
            console.log(err.message);
        }
        this.setState({renderDummy:!this.state.renderDummy})
    
    }
    render(){
        return(
            <div style={styles.container}>
                <div style = {styles.title}>Your Feed</div>
                <div style={styles.toolPanel}>
                    <Link className="btn btn-success btn-block" to="/upload">Upload a new Meme</Link>
                    <Link className="btn btn-success btn-block" to="/dashboard">Go to my Dashboard</Link>
                    <button className="btn btn-success btn-block" onClick={()=>{this.getImages()}}>add Images</button>
                </div>
                <div id="feed">
                    {this.images.map((img,index)=>{return( 
                        <div className="feedContainer" key={index}>
                            <img style = {styles.feedImage} key = {index}src={configs.images.location+img.image_id+"."+img.image_type}/>
                            <div style={styles.feedButtons}>
                                <div style={styles.feedButton} onClick={()=>{img.liked=!img.liked;this.setState({renderDummy:!this.state.renderDummy})}}>
                                    <ion-icon name="happy-outline" style={{color:img.liked?"green":"black",fontSize:"32px"}}></ion-icon>
                                </div>
                                <div style={styles.feedButton} onClick={()=>{
                                    
                                    img.comment=!img.comment;
                                    if(!img.comments.length){
                                        this.getComments(img)
                                    }
                                    
                                    this.setState({renderDummy:!this.state.renderDummy});
                                    }}>
                                    <ion-icon name="chatbubbles-outline" style={{color:"black",fontSize:"32px"}}></ion-icon>
                                </div>
                            </div>
                            {img.comment?
                                <div style={styles.feedComments}>
                                    {img.comments.map((comment,index)=>{
                                        return(
                                        <div key = {index}style={styles.feedComment}>
                                            <ion-icon style={{margin:"4px",color:"black"}} name="person"></ion-icon>
                                            {comment.comment_content}
                                            
                                        </div>
                                    )})}
                                    <div style={styles.inputComment}>
                                        <input style={{flexGrow:1}}type = "text" id = {"comment"+img.image_id}/>
                                        <button onClick={()=>{
                                            let text = document.getElementById("comment"+img.image_id);
                                            this.addComment(img,text.value);
                                            text.value="";}}>Submit</button>
                                    </div>
                                </div>
                                :
                                null
                            }
                        </div>
                    )})}
                </div>
            </div>
        )
    }
}

const styles = {
    container:{
        justifyContent:"center",
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        width:"100%"
    },
    toolPanel:{
        position:"absolute",
        top:0,
        left:0
    },
    title:{
        fontSize:35,
        padding:"50px",
        fontWeight:600
    },
    image:{
        margin:10,
        width:"90%",
        maxWidth:"500px",
    },
    feedImage:{
        width:"100%",
        height:"auto"
    },
    feedButtons:{
        width:"100%",
        display:"flex",
        flexDirection:"row",
        
    },
    feedButton:{
        flex:1,
        textAlign:"center",
        backgroundColor:"rgba(245,245,245,1)"
    },
    feedComments:{
        display:"flex",
        flexDirection:"column",
        backgroundColor:"rgba(245,245,245,1)"
    },
    inputComment:{
        display:"flex",
        flexDirection:"row",
        margin:"5px"
    },
    feedComment:{
        margin:"5px",
        display:"flex",
        flexDirection:"row"
    }

}