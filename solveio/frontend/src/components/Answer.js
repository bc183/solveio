import React, { useEffect, useState } from 'react'
import TailwindCard from './TailwindCard'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SyntaxHighlighter from "react-syntax-highlighter";
import { monokaiSublime } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Vote from './Vote';
import { useDispatch, useSelector } from 'react-redux';
import { customStyles } from '../css_var';
import Modal from 'react-modal';
import { useSnackbar } from 'react-simple-snackbar';
import CommentView from '../pages/CommentView';
import { motion } from 'framer-motion';
import moment from "moment";
import { DELETE_ANSWER_REQUEST, DELETE_ANSWER_SUCCESS } from '../redux/constants/answerListConstants';
import axiosInstance from '../axios/axiosInstance';
import { USER_DELETE_ANSWER_REQUEST, USER_DELETE_ANSWER_SUCCESS } from '../redux/constants/userAnswerListConstants';


export default function Answer({ answer, isUserAnswer = false }) {
    const { user, isLoggedIn } = useSelector(state => state.user);

    const [openSnackbar, closeSnackbar] = useSnackbar({ position: "top-right" });

    const [isDeleteOpen, setisDeleteOpen] = useState(false);
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const dispatch = useDispatch();

    const deleteAnswer = async (id) => {
        try {
            dispatch({ type: isUserAnswer ? USER_DELETE_ANSWER_REQUEST: DELETE_ANSWER_REQUEST });
            const response = await axiosInstance.delete(`/asnwers/delete/${id}/`);
            console.log(response);
            dispatch({ type: isUserAnswer ? USER_DELETE_ANSWER_SUCCESS: DELETE_ANSWER_SUCCESS, payload: { id } });
            openSnackbar("Deleted successfully.")
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <TailwindCard bgClass="bg-dark">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity : 1 }}>
                <div className="row">
                    <div className="col-1">
                        <i className="fas fa-user-circle px-2 text-white"></i>
                    </div>
                    <div className="col-9 mx-3 mx-sm-0">
                        <div className="flex justify-between">
                            <p className="text-md text-white-50 hover:cursor-pointer inline">{ answer.user?.user_name }</p>
                            <p className="text-md text-white-50 inline">{ moment(answer.created_at).fromNow() }</p>
                        </div>
                    </div>
                    {isLoggedIn && user?.id === answer?.user?.id && (<div className="col-2 flex justify-between">
                        <Link to={`/answer/${answer.id}/edit`}>
                            <i className="fas fa-edit text-white-50 hover:cursor-pointer"></i>
                        </Link>
                        <i onClick={() => setisDeleteOpen(true)} className="far fa-trash-alt text-white-50 hover:cursor-pointer mt-1"></i>
                    </div>)}
                </div>
                <div className="row">
                    <Vote post={answer} type={"ANSWER"} isUserAnswer={isUserAnswer} />
                    <div className="col-9 mx-3 mx-sm-0">
                        <div>
                            <p className="font-semibold text-white">{answer.body}</p>
                            {answer.code_body &&
                                <SyntaxHighlighter style={monokaiSublime}>
                                    {answer.code_body}
                                </SyntaxHighlighter>
                            }
                        </div>
                        <div className="row">
                            <div className="col-3 text-white-50 mt-4" onClick={() => setIsCommentOpen(true)}>
                                <div className="hover:cursor-pointer hover:bg-gray-800 w-fit px-3">
                                    <i className="far fa-comment mr-2 inline"></i>
                                    <span className="inline">{answer?.comments}</span> 
                                </div>
                            </div>
                            <div className="col-9 text-white-50 mt-4">
                                <p className="text-md text-white-50 inline">answered on { moment(answer.created_at).format("MMMM Do, YYYY") }</p>   
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={isDeleteOpen}
                    onRequestClose={() => setisDeleteOpen(false)}
                    style={customStyles}
                    contentLabel="Delete"
                >
                    <h4>This answer will be deleted.</h4>
                    <div className="flex justify-between mt-4">
                        <button onClick={() => setisDeleteOpen(false)} className="bg-gray-600 text-white font-bold py-2 px-4 rounded" type="button">
                            Cancel
                        </button>
                        <button onClick={() => deleteAnswer(answer.id)} className="bg-red-600 text-white font-bold py-2 px-4 rounded" type="button">
                            Delete
                        </button>
                    </div>
                </Modal>
                {isCommentOpen && <CommentView isUserAnswer={isUserAnswer} comments={answer.comments} answer={answer} isHome={false} setIsCommentOpen={setIsCommentOpen}/>}
            </motion.div>
        </TailwindCard>
    )
}
