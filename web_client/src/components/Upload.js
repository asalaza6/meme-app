import React, {Component} from 'react';
import {Redirect, Link} from 'react-router-dom';
import {View} from 'react';
import configs from '../config';

export default class Home extends Component{
    constructor(){
        super();
        this.state = {
            file: null,
            preview:null
        }
        this.fileInput = React.createRef();
        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    onChange(evt){
        let reader = new FileReader();
        let preview = document.getElementById('preview');
        let file = evt.target.files[0];
        this.setState({file:file});
        let that = this;
        reader.addEventListener("loadend", function () {
            // convert image file to base64 string
            that.setState({preview:reader.result});
            console.log(that.state.preview);}, false);
        if(file){
            reader.readAsDataURL(file);
        }
    }
    async handleSubmit(){
        if(this.state.file === null){
            alert('file not chosen');
            return;
        }
        let body = {
            name:this.state.file.name,
            content:this.state.preview
        }
        console.log(body);
        try{
            const response = await fetch(`http://${configs.api.url}:${configs.api.port}/dashboard/upload`,{
                method: "POST",
                headers:{
                    token: localStorage.token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body)
            });
            const parseRes = await response.json();
            console.log(parseRes);
        }catch(err){

        }
    }
    render(){
        return(
            <div style = {styles.container}>
                <div style = {styles.title}>Upload</div>
                    <form>
                        <label>
                            Upload a file
                            <br/>
                            <input onInput={this.onChange} accept="image/png, image/jpeg" type="file" ref={this.fileInput}/>
                        </label>
                    </form>
                    <img src={this.state.fileURL}/>
                    <div style = {styles.imgContainer}>
                        <img style = {styles.img} id="preview" src={this.state.preview}/>
                    </div>
                <button onClick={this.handleSubmit}>Submit</button>
            </div>
        )
    }
}

const styles = {
    container:{
        margin:10,
        justifyContent:"center",
        display:"flex",
        flexDirection:"column",
        alignItems:"center"
    },
    title:{
        fontSize:35,
        padding:10,
        fontWeight:600
    },
    imgContainer:{
        width:"90%",
        overflow:"hidden"
    },
    img:{
        height:"auto",
        width:"100%",
        padding:"10px"
    },

}