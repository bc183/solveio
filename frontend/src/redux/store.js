import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { userReducer } from './reducers/userReducer';
import axiosInstance from '../axios/axiosInstance';
import { GET_CURRENT_USER } from './constants/userConstants';
import { postListReducer } from './reducers/postListReducer';
import { postReducer } from './reducers/postReducer';
import { answerListReducer } from './reducers/answerListReducer';
import { answerReducer } from './reducers/answerReducer';
import { searchReducer } from './reducers/searchReducer';
import { searchListReducer } from './reducers/searchListReducer';
import { userPostListReducer } from './reducers/userPostListReducer';
import { userAnswerListReducer } from './reducers/UserAnswerListReducer';

const reducer = combineReducers({
    user: userReducer,
    postList: postListReducer,
    post: postReducer,
    answerList: answerListReducer,
    answer: answerReducer,
    search: searchReducer,
    searchList: searchListReducer,
    userPostList: userPostListReducer,
    userAnswerList: userAnswerListReducer
});



const initialState = {
    user: {
        user: {},
        errorMessage: null,
        loading: false
    },
    postList: {
        postList: [],
        loading: false,
        errorMessage: null
    },
    answerList: {
        asnwerList: [],
        loading: false,
        errorMessage: null
    },
    searchList: {
        searchList: [],
        loading: false,
        errorMessage: null
    },
    userPostList: {
        userPostList: [],
        loading: false,
        errorMessage: null
    },
    userAnswerList: {
        userAnswerList: [],
        loading: false,
        errorMessage: null
    },
    search: {
        searchTerm: ""
    }
}

const middlewares = [thunk]

const store = createStore(reducer, initialState, 
                            composeWithDevTools(applyMiddleware(...middlewares)));

const getUser = async () => {
    try {
        const userResponse = await axiosInstance.get('/users/me/');
        store.dispatch({ type: GET_CURRENT_USER, payload: userResponse.data });
    } catch (error) {
        store.dispatch({ type: GET_CURRENT_USER, payload: {} });
        console.log(error);
    }
}

getUser();

export default store;