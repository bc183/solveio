import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axiosInstance from "../axios/axiosInstance";
import RingLoader from "react-spinners/RingLoader";
import { ADD_COMMENT_ANSWER, ADD_COMMENT_QUESTION, ADD_COMMENT_USER_ANSWER } from '../redux/constants/commentConstants';
import moment from "moment";
import { motion } from 'framer-motion';
import UpdateCommentModal from './UpdateCommentModal';
import { useSnackbar } from 'react-simple-snackbar';
import DeleteCommentModal from './DeleteCommentModal';


export default function CommentList({ post, answer, isHome, setIsCommentOpen, isUserAnswer = false }) {
    const [comments, setComments] = useState([]);
    const [commentTobeUpdated, setCommentTobeUpdated] = useState({ value: "", error: null, id: null });
    const [commentsTrimmed, setCommentsTrimmed] = useState([]);
    const [commentToBeDeletedId, setCommentToBeDeletedId] = useState(null);
    const [size, setSize] = useState(3);
    const [updateCommentModalOpen, setUpdateCommentModalOpen] = useState(false);
    const [deleteCommentModalOpen, setDeleteCommentModalOpen] = useState(false);
    const { isLoggedIn, user } = useSelector(state => state.user);
    const [comment, setComment] = useState({ value: "", error: null });
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [openSnackbar, closeSnackbar] = useSnackbar({ position: "top-right" });
    const getComments = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`comment/${post ? post.id: answer.id}/${post ? "QUESTION": "ANSWER"}/`);
            setComments(response.data);
            setCommentsTrimmed(response.data.slice(0, size));
            setLoading(false);
            console.log(commentsTrimmed);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }
    useEffect(() => {
        getComments();
    }, [])

    useEffect(() => {
        setCommentsTrimmed(comments.slice(0, size));
    }, [size])

    const postComment = async () => {
        if (comment.value === "" || comment.error !== null) {
            return
        }
        // post comment
        try {
            setLoading(true);
            const data = {
                comment: comment.value,
                type: post ? "QUESTION": "ANSWER"
            }
            const response = await axiosInstance.post(`comment/${post ? post.id: answer.id}/`, data);
            console.log(response);
            if (post) {
                dispatch({ type: ADD_COMMENT_QUESTION, payload: { postId: post.id, comment: comment } });
            }
            if (answer && isUserAnswer) {
                dispatch({ type: ADD_COMMENT_USER_ANSWER, payload: { answerId: answer.id, comment: comment } });
            }
            if (answer && !isUserAnswer) {
                dispatch({ type: ADD_COMMENT_ANSWER, payload: { answerId: answer.id, comment: comment } });
            }
            setComment({ value: "", error: null });
            getComments();
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    const handleCommentChange = (event) => {
        const value = event.target.value;
        if (value === "") {
            setComment({
                value: value,
                error: "Please enter Comment."
            });
            return;
        }

        setComment({
            value: value,
            error: null
        });
    }

    const handleCommentToBeUpdatedChange = (event, id) => {
        const value = event.target.value;
        if (value === "") {
            setCommentTobeUpdated({
                value: value,
                error: "Please enter Comment.",
                id: id
            });
            return;
        }

        setCommentTobeUpdated({
            value: value,
            error: null,
            id: id
        });
    }

    const updateComment = async () => {
        if (commentTobeUpdated.value === "" || commentTobeUpdated.error !== null) {
            return
        }
        try {
            setLoading(true);
            const data = {
                comment: commentTobeUpdated.value,
                type: post ? "QUESTION": "ANSWER"
            }
            console.log(commentTobeUpdated);
            await axiosInstance.put(`comment/update/${commentTobeUpdated.id}/`, data);
            openSnackbar("Comment Updated.");
            getComments();
            setLoading(false);
            setUpdateCommentModalOpen(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const deleteComment = async (id) => {
        try {
            setLoading(true);
            await axiosInstance.delete(`comment/delete/${id}/`);
            openSnackbar("Comment Deleted.");
            getComments();
            setLoading(false);
            setDeleteCommentModalOpen(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    return (
        <motion.div initial={{ y:200 }} animate={{ y: 0 }}>
            {loading && 
            <div className="flex mt-2 justify-content-center">
                <RingLoader size={40} css={"color: #4f545c; display: block; align-self: center"} />
            </div>}
            {!loading && 
                <React.Fragment>
                    <div className="flex justify-between">
                        <div></div>
                        <div className="hover:cursor-pointer" onClick={() => setIsCommentOpen(false)}>
                            <i className="fa fa-close fa-sm text-gray-400"></i>
                        </div>
                    </div>
            {isLoggedIn ? 
                <div>
                    <div className="mb-4">
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="comment">
                            Comment
                        </label>
                        <input className="shadow appearance-none inline bg-gray-600 border rounded w-10/12 py-2 px-3 text-white mb-3" value={comment.value} id="comment" type="text" placeholder="comment" onChange={handleCommentChange}></input>
                        <i onClick={postComment} className={`${comment.value === "" ?  "text-gray-400": "hover:cursor-pointer text-green-300"} far fa-check-circle mx-2 text-gray-400`}></i>
                        {comment.error && <p className="text-red-600 text-xs italic"> {comment.error} </p>}
                    </div>
                </div>: <div className="text-white-50 my-4">You need to log in to post a comment.</div> }
            
            { commentsTrimmed?.map((comment, index) => (
                <div key={index} className="row">
                    <div className="col-1 px-2">
                        <i className="fas fa-user-circle px-2 text-white"></i>
                    </div>
                    <div className="col-9">
                        <p className="text-md text-white-50 hover:cursor-pointer inline pr-2">{ comment?.user?.user_name }</p>
                    </div>
                    {isLoggedIn && user?.id === comment?.user?.id && (<div className="col-2 flex justify-between">
                        <i className="fas fa-edit text-white-50 hover:cursor-pointer mx-2" onClick={() => { setUpdateCommentModalOpen(true); setCommentTobeUpdated({value: comment.comment, error: null, id: comment.id }); console.log(commentTobeUpdated); }} ></i>
                        <i className="far fa-trash-alt text-white-50 hover:cursor-pointer" onClick={() => { setDeleteCommentModalOpen(true); setCommentToBeDeletedId(comment.id) }} ></i>
                    </div>)}
                    <div className="col-11 offset-1">
                        <p className="text-sm text-white">{comment.comment}</p>
                    </div>
                    <div className="flex justify-end">
                        <p className="text-sm text-white-50 inline">{ moment(comment.created_at).fromNow() }</p>
                    </div>
                    <hr className="text-white"></hr>
                </div>
            )) }
                <p className="text-sm hover:cursor-pointer text-white-50" onClick={() => setSize(size + 3)}>{comments.length < size ? "No more comments to load.":"Load more comments for this post..."}</p>
            </React.Fragment>}
            <UpdateCommentModal updateComment={updateComment} loading={loading} open={updateCommentModalOpen} setOpen={setUpdateCommentModalOpen} comment={commentTobeUpdated} handleCommentChange={handleCommentToBeUpdatedChange} />
            <DeleteCommentModal isDeleteOpen={deleteCommentModalOpen} setisDeleteOpen={setDeleteCommentModalOpen} loading={loading} id={commentToBeDeletedId} deleteComment={deleteComment} />
        </motion.div>
        
    )
}
