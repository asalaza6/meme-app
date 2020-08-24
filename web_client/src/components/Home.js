import React, {Component} from 'react';
import { Link} from 'react-router-dom';

export default class Home extends Component{
    

    render(){
        return(
            <div style = {styles.container}>
                <div style = {styles.title}>Welcome to Meme it 2 win it!</div>
                <img alt = "home" style = {styles.image} src = "https://i.ytimg.com/vi/UZtgutRejUM/maxresdefault.jpg"></img>
                
                <Link className="btn btn-success btn-block" to="/login">Login</Link>
                <Link className="btn btn-success btn-block" to="/register">Register</Link>
                
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