import { SET_WALLET_ADDRESS, GET_WALLET_DATA, BEFORE_WALLET_DATA} from "../../redux/types";

const initialState = {
    accountAddress: null,
    data: [],
    pagination: null
}

export default function ( state = initialState, action ){
    switch (action.type) {
        case SET_WALLET_ADDRESS:
            return {
                ...state,
                accountAddress: action.payload
            }
        case GET_WALLET_DATA:
            return {
                ...state,
                data: [...state.data,  ...action.payload.walletData ],
                pagination: action.payload.pagination
            }
        case BEFORE_WALLET_DATA:
            return {
                ...state,
                data: [],
                pagination: null
            }
        default:
            return {
                ...state
            }
    }
}