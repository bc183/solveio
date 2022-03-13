import { GET_CURRENT_USER, USER_LOGIN_FAILURE, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_REGISTER_FAILURE, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS } from "../constants/userConstants";

export const userReducer = (state = {user: {}, errorMessage: null, loading: false, isLoggedIn: false}, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return {
                user: {},
                loading: true,
                errorMessage: null,
                isLoggedIn: false
            }
        case USER_LOGIN_SUCCESS:
            return {
                user: {},
                loading: false,
                errorMessage: null,
                isLoggedIn: true
            }
        case USER_LOGIN_FAILURE:
            return {
                user: {},
                loading: false,
                errorMessage: action.payload,
                isLoggedIn: false
            }
        case USER_REGISTER_REQUEST:
            return {
                user: {},
                loading: true,
                errorMessage: null,
                isLoggedIn: false
            }
        case USER_REGISTER_SUCCESS:
            return {
                user: {},
                loading: false,
                errorMessage: null,
                isLoggedIn: false
            }
        case USER_REGISTER_FAILURE:
            return {
                user: {},
                loading: false,
                errorMessage: action.payload,
                isLoggedIn: false
            }
        case GET_CURRENT_USER:
            return {
                user: action.payload,
                loading: false,
                errorMessage: null,
                isLoggedIn: action.payload.user_name ? true: false
            }
        default:
            return state
    }
}