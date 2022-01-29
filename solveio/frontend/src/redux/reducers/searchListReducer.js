import { POST_LIST_FAILURE } from "../constants/postListConstants";
import { CLEAR_SEARCH_LIST, SEARCH_LIST_FAILURE, SEARCH_LIST_REQUEST, SEARCH_LIST_SUCCESS } from "../constants/searchListConstants";
import { SEARCH_VOTE } from "../constants/voteConstants";

export const searchListReducer = (state = { searchList: [], loading: false, errorMessage: null, isUser: false }, action) => {
    switch (action.type) {
        case SEARCH_LIST_REQUEST:
            return {
                ...state,
                loading: true,
                errorMessage: null
            }
        case SEARCH_LIST_SUCCESS:
            if (action.payload.page === 1) {
                return {
                    searchList: action.payload.data,
                    loading: false,
                    errorMessage: null,
                    isUser: action.payload.isUser
                }
            }
            let temp = state.searchList;
            temp = temp.concat(action.payload.data);
            return {
                searchList: temp,
                loading: false,
                errorMessage: null,
                isUser: action.payload.isUser
            }
        case SEARCH_LIST_FAILURE:
            return {
                ...state,
                loading: false,
                errorMessage: action.payload
            } 
        case CLEAR_SEARCH_LIST: 
            return {
                searchList: [],
                loading: false,
                errorMessage: null
            }
        case SEARCH_VOTE:
            const { id, value } = action.payload
            console.log(id, value);
            let searchList = state.searchList;
            searchList.forEach(post => {
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
            });
            
            return {
                ...state,
                searchList: searchList
            }
        default:
            return state
    }
}