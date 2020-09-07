import React, { Fragment, useState } from "react";
import {toast} from 'react-toastify';
import configs from '../config';
import { Link} from 'react-router-dom';

const Dashboard = ({setAuth})=> {
    const [name, setName] = useState("");

    async function getName(){
        try{
            const response = await fetch(`${configs.api.url}:${configs.api.port}/dashboard`,{
                method: "GET",
                headers:{
                    token: localStorage.token
                }
            });
            const parseRes = await response.json();
            //console.log(parseRes);
            setName(parseRes.user_name);
        }catch(err){

        }
    }

    const logout = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        setAuth(false);
        toast.success("Logout successfully");
    }
    getName();
    return (
        <Fragment>
            <h1>Dashboard</h1>
            <h2>{name}</h2>
            <Link className="btn btn-success btn-block" to="/">Go back to Feed</Link>
            <button className="btn btn-primary" onClick={e=>logout(e)}>Logout</button>
        </Fragment>
    )
}

export default Dashboard;
