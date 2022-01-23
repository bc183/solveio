import { ADD_COMMENT_USER_ANSWER } from "../constants/commentConstants";
import { USER_ANSWER_LIST_FAILURE, USER_ANSWER_LIST_REQUEST, USER_ANSWER_LIST_SUCCESS, USER_DELETE_ANSWER_FAIL, USER_DELETE_ANSWER_REQUEST, USER_DELETE_ANSWER_SUCCESS } from "../constants/userAnswerListConstants";
import { USER_ANSWER_VOTE } from "../constants/voteConstants";

export const userAnswerListReducer = (state = { userAnswerList: [], loading: false, errorMessage: null }, action) => {
    switch (action.type) {
        case USER_ANSWER_LIST_REQUEST:
            return {
                ...state,
                loading: true,
                errorMessage: null
            }
        case USER_ANSWER_LIST_SUCCESS:
            if (action.payload.page === 1) {
                return {
                    userAnswerList: action.payload.data,
                    loading: false,
                    errorMessage: null
                }
            }
            let temp = state.userAnswerList;
            temp = temp.concat(action.payload.data);
            return {
                userAnswerList: temp,
                loading: false,
                errorMessage: null
            }
        case USER_ANSWER_LIST_FAILURE:
            return {
                ...state,
                loading: false,
                errorMessage: action.payload
            } 
        case USER_ANSWER_VOTE:
            const { id, value } = action.payload
            console.log(id, value);
            let userAnswerList = state.userAnswerList;
            userAnswerList.forEach(post => {
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
                userAnswerList: userAnswerList
            }
        case ADD_COMMENT_USER_ANSWER:
            const { answerId } = action.payload;
            let userAnswerListTemp = state.userAnswerList;
            userAnswerListTemp.forEach(answer => {
                if (answer.id === answerId) {
                    answer.comments += 1;
                }
            });
            return {
                userAnswerList: userAnswerListTemp,
                loading: false,
                errorMessage: null,
            }
        case USER_DELETE_ANSWER_REQUEST:
            return {
                ...state,
                loading: true,
                errorMessage: null
            }
        case USER_DELETE_ANSWER_SUCCESS: 
            let tempuserAnswerList = state.userAnswerList;
            const { id: answerIdDelete } = action.payload;
            const index = tempuserAnswerList.findIndex(answer => answer.id === answerIdDelete)
            tempuserAnswerList.splice(index, 1);
            return {    
                userAnswerList: tempuserAnswerList,
                loading: false,
                errorMessage: null
            }
        case USER_DELETE_ANSWER_FAIL:
            return {
                ...state,
                loading: false,
                errorMessage: action.payload
            }
        default:
            return state;
    }
}