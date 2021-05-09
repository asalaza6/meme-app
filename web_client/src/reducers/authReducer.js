import {AUTHORIZE} from '../actions/authAction';
const initialState = {
    auth: false
}


export default function authReducer(state = initialState, action){
    switch(action.type){
        //do something here based on different types of action
        case AUTHORIZE:
            //console.log(action.payload);
            return {...state, 
            auth: true}
        default:
            return state
    }
}