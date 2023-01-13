import { GET_FAQ } from "../../redux/types";

const initialState = {
    faqs: null
}

export default function( state = initialState, action ){
    switch (action.type) {
        case GET_FAQ:
            return {
                ...state,
                faqs: action.payload
            }
        default:
            return {
                ...state
            }
    }
}