import { combineReducers } from 'redux';
import ingredientReducer from './Ingredients/Ingredients.reducer'
import categoryRedcuer from './Categories/categories.reducer'
import walletReducer from './../components/Wallet/Wallet.reducer';
import userReducer from '../components/user/user.reducer';
import userIngredientsReducer from './userIngredients/userIngredients.reducer';
import faqsReducer from '../components/Faq/Faq.reducer';
import errorReducer from './error/error.reducer';
import settingReducer from '../components/Settings/Setting.reducer';
import caveReducer from '../components/Cave/Cave.reducer';
import artistReducer from '../components/Artist/Artist.reducer';
import rewardReducer from '../components/Rewards/Rewards.reducer';

export default combineReducers({
    wallet: walletReducer,
    user: userReducer,
    ingredient:ingredientReducer,
    category :categoryRedcuer,
    userIngredients:userIngredientsReducer,
    error: errorReducer,
    faq: faqsReducer,
    setting: settingReducer,
    cave: caveReducer,
    artist: artistReducer,
    reward: rewardReducer
})