import { GET_CATEGORIES } from '../types';

const initialState = {
    categories: null,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_CATEGORIES:
            return {
                ...state,
                categories: action.payload,
            }
        default:
            return {
                ...state
            }
    }
}