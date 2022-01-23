import { ANSWER_LIST_FAILURE, ANSWER_LIST_REQUEST, ANSWER_LIST_SUCCESS, DELETE_ANSWER_FAIL, DELETE_ANSWER_REQUEST, DELETE_ANSWER_SUCCESS } from "../constants/answerListConstants";
import { ADD_COMMENT_ANSWER } from "../constants/commentConstants";
import { ANSWER_VOTE } from "../constants/voteConstants";

export const answerListReducer = (state = { answerList: [], loading: false, errorMessage: null }, action) => {
    switch (action.type) {
        case ANSWER_LIST_REQUEST:
            return {
                ...state,
                loading: true,
                errorMessage: null
            }
        case ANSWER_LIST_SUCCESS:
            if (action.payload.page === 1) {
                return {
                    answerList: action.payload.data,
                    loading: false,
                    errorMessage: null
                }
            }
            let temp = state.answerList;
            temp = temp.concat(action.payload.data);
            return {
                answerList: temp,
                loading: false,
                errorMessage: null
            }
        case ANSWER_LIST_FAILURE:
            return {
                ...state,
                loading: false,
                errorMessage: action.payload
            } 
        case ANSWER_VOTE:
            const { id, value } = action.payload
            console.log(id, value);
            let answerList = state.answerList;
            answerList.forEach(answer => {
                if (answer.id === id) {
                    if (answer.user_vote === null) {
                        if (value === 1) {
                            answer.up_votes += 1
                        } else if (value === -1) {
                            answer.down_votes += 1 
                        }
                    } else {
                        if (value === 1 && answer.user_vote !== value) {
                            answer.up_votes += 1
                            answer.down_votes -= 1 
                        } else if (value === -1 && answer.user_vote !== value) {
                            answer.down_votes += 1 
                            answer.up_votes -= 1
                        }
                    }
                    
                    answer.rating = answer.up_votes - answer.down_votes;
                    answer.user_vote = value;
                }
            });
            
            return {
                ...state,
                answerList: answerList
            }
        case ADD_COMMENT_ANSWER:
            const { answerId } = action.payload;
            let answerListTemp = state.answerList;
            answerListTemp.forEach(answer => {
                if (answer.id === answerId) {
                    answer.comments += 1;
                }
            });
            return {
                answerList: answerListTemp,
                loading: false,
                errorMessage: null,
            }
        case DELETE_ANSWER_REQUEST:
            return {
                ...state,
                loading: true,
                errorMessage: null
            }
        case DELETE_ANSWER_SUCCESS: 
            let tempAnswerList = state.answerList;
            const { id: answerIdDelete } = action.payload;
            const index = tempAnswerList.findIndex(answer => answer.id === answerIdDelete)
            tempAnswerList.splice(index, 1);
            return {    
                answerList: tempAnswerList,
                loading: false,
                errorMessage: null
            }
        case DELETE_ANSWER_FAIL:
            return {
                ...state,
                loading: false,
                errorMessage: action.payload
            }
        default:
            return state;
    }
}