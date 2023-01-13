import { BEFORE_RARITY_REWARD_PIZZA, GET_RARITY_REWARD_PIZZA } from '../../redux/types';

const initialState = {
    rarityRewardsPizza: [],
    pagination: null,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_RARITY_REWARD_PIZZA:
            return {
                ...state,
                rarityRewardsPizza: [...state.rarityRewardsPizza, ...action.payload.pizza],
                pagination: action.payload.pagination,
            }
        case BEFORE_RARITY_REWARD_PIZZA: 
            return {
                ...state,
                rarityRewardsPizza: [],
                pagination: null
            }
        default:
            return {
                ...state
            }
    }
}