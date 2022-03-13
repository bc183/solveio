import { ADD_COMMENT_QUESTION } from "../constants/commentConstants";
import { CREATE_POST_FAIL, CREATE_POST_REQUEST, CREATE_POST_SUCCESS, DELETE_POST_FAIL, DELETE_POST_REQUEST, DELETE_POST_SUCCESS, EDIT_POST_FAIL, EDIT_POST_REQUEST, EDIT_POST_SUCCESS, GET_POST_FAIL, GET_POST_REQUEST, GET_POST_SUCCESS, SET_POST_VOTE, UNSET_CREATED_POST } from "../constants/postConstants";

export const postReducer = (state = {post: null, loading: false, errorMessage: null, createdPost: false }, action) => {
    switch (action.type) {
        case CREATE_POST_REQUEST:
            return {
                post: null,
                loading: true,
                errorMessage: null,
                createdPost: false
            }
        case CREATE_POST_SUCCESS:
            return {
                post: action.payload,
                loading: false,
                errorMessage: null,
                createdPost: true
            }
        case CREATE_POST_FAIL:
            return {
                post: null,
                loading: false,
                errorMessage: action.payload,
                createdPost: false
            }
        case GET_POST_REQUEST:
            return {
                post: null,
                loading: true,
                errorMessage: null,
                createdPost: false
            }
        case GET_POST_SUCCESS:
            return {
                post: action.payload,
                loading: false,
                errorMessage: null,
                createdPost: false
            }
        case GET_POST_FAIL:
            return {
                post: null,
                loading: false,
                errorMessage: action.payload,
                createdPost: false
            }
        case UNSET_CREATED_POST:
            return {
                post: null,
                loading: false,
                errorMessage: null,
                createdPost: false
            }
        case SET_POST_VOTE:
            const { id, value } = action.payload;
            let post = state.post;
            if (!post) {
                return state;
            }
            if (post.id === id) {
                if (post.user_vote === null) {
                    if (value === 1) {
                        post.up_votes += 1
                    } else if (value === -1) {
                        post.down_votes += 1 
                    }
                } else {
                    if (value === 1 && post.user_vote !== value) {
                        post.up_votes += 1
                        post.down_votes -= 1 
                    } else if (value === -1 && post.user_vote !== value) {
                        post.down_votes += 1 
                        post.up_votes -= 1
                    }
                }
                
                post.rating = post.up_votes - post.down_votes;
                post.user_vote = value;
            }
            return {
                ...state,
                post: post
            }
        case EDIT_POST_REQUEST:
            return {
                post: null,
                loading: true,
                errorMessage: null,
                createdPost: false
            }
        case EDIT_POST_SUCCESS:
            return {
                post: action.payload,
                loading: false,
                errorMessage: null,
                createdPost: false
            }
        case EDIT_POST_FAIL:
            return {
                post: null,
                loading: false,
                errorMessage: action.payload,
                createdPost: false
            }
        case DELETE_POST_REQUEST:
            return {
                post: null,
                loading: true,
                errorMessage: null,
                createdPost: false,
            }
        case DELETE_POST_SUCCESS:
            return {
                post: action.payload,
                loading: false,
                errorMessage: null,
                createdPost: false,
                postDeleted: true
            }
        case DELETE_POST_FAIL:
            return {
                post: null,
                loading: false,
                errorMessage: action.payload,
                createdPost: false,
                postDeleted: true
            }
        case ADD_COMMENT_QUESTION:
            let temp = state.post;
            temp.comments += 1;
            return {
                post: temp,
                loading: false,
                errorMessage: null,
                createdPost: false,
                postDeleted: false
            }
        default:
            return state;
    }
}