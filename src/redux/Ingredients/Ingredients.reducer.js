import { GET_INGREDIENTS, BEFORE_INRGEDIENT } from '../../redux/types';

const initialState = {
    ingredients:[],
    pagination: null,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_INGREDIENTS:
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload.ingredients],
                pagination: action.payload.pagination,
            }
        case BEFORE_INRGEDIENT: 
            return {
                ...state,
                ingredients: [],
                pagination: null
            }
        default:
            return {
                ...state
            }
    }
}