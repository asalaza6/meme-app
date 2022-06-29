import {ADD_USER, LOGOUT, AUTHORIZE} from '../actions/userAction';


const initialState = {
    username: null,
    auth: false
}


export default function userReducer(state = initialState, action){
    switch(action.type){
        //do something here based on different types of action
        case ADD_USER:
            //console.log(action.payload)
            return {...state, 
            username: action.payload.username}
        case LOGOUT:
            console.log("loggin out")
            return {username: null,auth:false}
        case AUTHORIZE:
            //console.log(action.payload);
            return {...state, 
            auth: true}
        default:
            return state
    }
}