import React, {Component} from 'react';
import {Redirect, Link} from 'react-router-dom';
import {View} from 'react';

export default class Home extends Component{
    constructor(){
        super();
    }

    render(){
        return(
            <div style = {styles.container}>
                <div style = {styles.title}>Welcome to Meme it 2 win it!</div>
                <img style = {styles.image} src = "https://i.ytimg.com/vi/UZtgutRejUM/maxresdefault.jpg"></img>
                <button onClick={()=>{this.props.history.push('/login')}} className="btn btn-success btn-block">Login</button>
                <Link to="/login">Login</Link>
                <button className="btn btn-success btn-block">Register</button>
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
    image:{
        margin:10,
        width:"90%"
    },

}