import {ADD_USER} from '../actions/userAction';
const initialState = {
    username: "noone",
    user_id: null
}


export default function userReducer(state = initialState, action){
    switch(action.type){
        //do something here based on different types of action
        case ADD_USER:
            //console.log(action.payload)
            return {...state, 
            username: action.payload.username,
            user_id: action.payload.id}
        default:
            return state
    }
}