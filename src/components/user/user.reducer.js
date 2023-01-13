import { SET_USER , DISCONNECT_USER} from "../../redux/types";

const initialState = {
    userData: null,
    userAuth: false
}

export default function( state = initialState, action) {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                userData: action.payload,
                userAuth: true
            }
        case DISCONNECT_USER:
            localStorage.removeItem("wallet_address")
            localStorage.removeItem("encuser")
            return {
                ...state,
                userData: null,
                userAuth: false
            }
        default:
            return {
                ...state
            }
    }
}