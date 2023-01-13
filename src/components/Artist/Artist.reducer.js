import { GET_ARTISTS, BEFORE_ARTISTS } from "../../redux/types";

const initialState = {
    artists: [],
    pagination: null
}

export default function ( state = initialState, action ) {
    switch (action.type) {
        case GET_ARTISTS:
            return { 
                ...state,
                artists: [...state.artists, ...action.payload.data],
                pagination: action.payload.pagination
            }
        case BEFORE_ARTISTS:
            return {
                ...state,
                artists: [],
                pagination: null
            }
        default:
            return {
                ...state
            }
    }
}