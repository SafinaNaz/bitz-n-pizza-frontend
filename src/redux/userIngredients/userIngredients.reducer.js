import { GET_USER_INGREDIENTS,Buy_INGREDIENT, BEFORE_USER_INRGEDIENT, RANDOM_PIZZA_INGREDIENTS } from '../types';

const initialState = {
    userIngredients: [],
    buyIngredient: null,
    randomPizzaIngredient: null,
    pagination: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_USER_INGREDIENTS:
            return {
                ...state,
                userIngredients: [...state.userIngredients, ...action.payload.ingredients],
                pagination: action.payload.pagination,
            }
        case BEFORE_USER_INRGEDIENT: 
            return {
                ...state,
                userIngredients: [],
                pagination: null,
                buyIngredient: null
            }
        case RANDOM_PIZZA_INGREDIENTS: 
            return {
                ...state,
                randomPizzaIngredient: action.payload
            }
        case Buy_INGREDIENT: 
            return {
                ...state,
                buyIngredient: action.payload
            }
        default:
            return {
                ...state
            }
    }
}