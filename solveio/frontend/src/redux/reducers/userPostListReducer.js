import { USER_POST_LIST_FAILURE, USER_POST_LIST_REQUEST, USER_POST_LIST_SUCCESS } from "../constants/userPostListConstants";
import { USER_POST_VOTE } from "../constants/voteConstants";

export const userPostListReducer = (state = { userPostList: [], loading: false, errorMessage: null }, action) => {
    switch (action.type) {
        case USER_POST_LIST_REQUEST:
            return {
                ...state,
                loading: true,
                errorMessage: null
            }
        case USER_POST_LIST_SUCCESS:
            if (action.payload.page === 1) {
                return {
                    userPostList: action.payload.data,
                    loading: false,
                    errorMessage: null
                }
            }
            let temp = state.userPostList;
            temp = temp.concat(action.payload.data);
            return {
                userPostList: temp,
                loading: false,
                errorMessage: null
            }
        case USER_POST_LIST_FAILURE:
            return {
                ...state,
                loading: false,
                errorMessage: action.payload
            } 
        case USER_POST_VOTE:
            const { id, value } = action.payload
            console.log(id, value);
            let userPostList = state.userPostList;
            userPostList.forEach(post => {
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
                userPostList: userPostList
            }
        default:
            return state;
    }
}