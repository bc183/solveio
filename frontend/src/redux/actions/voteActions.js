import axiosInstance from "../../axios/axiosInstance";
import { SET_POST_VOTE } from "../constants/postConstants";
import { QUESTION_VOTE, ANSWER_VOTE, SEARCH_VOTE, USER_POST_VOTE, USER_ANSWER_VOTE } from "../constants/voteConstants"

export const vote = ({ postId, value, type, isSearch, isUserPost, isUserAnswer }) => async (dispatch) => {
    try {
        console.log(isUserAnswer);
        if (isSearch) {
            dispatch({ type: SEARCH_VOTE, payload: { id: postId, value } });
        } else if (isUserPost) {
            dispatch({ type: USER_POST_VOTE, payload: { id: postId, value } });
        } else if (isUserAnswer) {
            dispatch({ type: USER_ANSWER_VOTE, payload: { id: postId, value } });
        } else {
            dispatch({ type: type === "QUESTION" ? QUESTION_VOTE: ANSWER_VOTE, payload: { id: postId, value } });
        }
        dispatch({ type: SET_POST_VOTE, payload: { id: postId, value } }); 
        const response = await axiosInstance.post(`posts/vote/${postId}/`, { vote: value, type });
    } catch (error) {
        console.log(error);
    }
}