import React, { useEffect, useState } from 'react'
import TailwindCard from './TailwindCard'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SyntaxHighlighter from "react-syntax-highlighter";
import { monokaiSublime } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Vote from './Vote';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../axios/axiosInstance';
import { DELETE_POST_REQUEST, DELETE_POST_SUCCESS } from '../redux/constants/postConstants';
import { customStyles } from '../css_var';
import Modal from 'react-modal';
import { useSnackbar } from 'react-simple-snackbar';
import CommentView from '../pages/CommentView';
import moment from "moment";
import { motion } from 'framer-motion';
import { SET_SEARCH_TERM } from '../redux/constants/searchConstants';

export default function Post({ post, isHome, isSearch, isUserPost = false }) { 

    const { search } = useLocation();
    const queryParams = new URLSearchParams(search).getAll("comment-open");
    const isCommentOpenFromUrl = queryParams.length > 0 ? queryParams[0] === "true": false; 

    const { user, isLoggedIn } = useSelector(state => state.user);

    const [openSnackbar, closeSnackbar] = useSnackbar({ position: "top-right" });

    const [isDeleteOpen, setisDeleteOpen] = useState(false);
    const [isCommentOpen, setIsCommentOpen] = useState(isCommentOpenFromUrl);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const goToPostsPage = (id) => {
        if (!isHome) {
            return;
        }
        navigate(`/post/${id}`);
    }

    const deletePost = async (id) => {
        try {
            dispatch({ type: DELETE_POST_REQUEST });
            const response = await axiosInstance.delete(`/posts/delete/${id}/`);
            console.log(response);
            dispatch({ type: DELETE_POST_SUCCESS });
            navigate("/");
            openSnackbar("Deleted successfully.")
        } catch (error) {
            console.log(error);
        }
    }

    const onCommentClick = (postId) => { 
        if (!isHome) setIsCommentOpen(true);
        else navigate(`/post/${postId}?comment-open=true`);
    }

    const getTagPosts = (tag) => {
        dispatch({ type: SET_SEARCH_TERM, payload: `#${tag.tag}`});
        navigate("/search");
    }

    return (
        <motion.div whileHover={{ scale: isHome && 1.02 }}>
            <TailwindCard bgClass="bg-dark">
                <div className="row">
                    <div className="col-1">
                        <i className="fas fa-user-circle px-2 text-white"></i>
                    </div>
                    <div className="col-9 mx-3 mx-sm-0">
                        <div className="flex justify-between">
                            <Link className="text-md text-white-50 hover:cursor-pointer inline no-underline" to={`/user/${post?.user?.id}`}>{ post.user?.user_name }</Link>
                            <p className="text-md text-white-50 inline">{ moment(post.created_at).fromNow() }</p>
                        </div>
                    </div>
                    {!isHome && isLoggedIn && user?.id === post?.user?.id && (<div className="col-2 flex justify-between">
                        <Link to={`/post/${post.id}/edit`}>
                            <i className="fas fa-edit text-white-50 hover:cursor-pointer"></i>
                        </Link>
                        <i onClick={() => setisDeleteOpen(true)} className="far fa-trash-alt text-white-50 hover:cursor-pointer mt-1"></i>
                    </div>)}
                </div>
                <div className="row">
                    <Vote post={post} type={"QUESTION"} isSearch={isSearch} isUserPost={isUserPost} />
                    <div className="col-9 mx-3 mx-sm-0">
                        <div>
                            <div className={`${isHome && "hover:cursor-pointer"}`} onClick={() => goToPostsPage(post.id)}>
                                <p className="font-semibold text-xl text-white">{post.title}</p>
                                <p className="font-semibold text-white">{isHome && post.body.length > 100 ? post.body.slice(0, 100) + ".....": post.body}</p>
                                {!isHome && post.code_body &&
                                    <SyntaxHighlighter style={monokaiSublime}>
                                        {post.code_body}
                                    </SyntaxHighlighter>
                                }
                            </div>
                            { post?.tags?.length > 0 &&
                                <div className="flex">  
                                    {post?.tags?.map((tag, index) => (
                                        <div key={index} className="mx-1">
                                            <motion.div whileHover={{ scale: 1.05 }} onClick={() => getTagPosts(tag)} className="hover:cursor-pointer bg-gray-800 w-fit px-1 shadow">
                                                <p className="text-white-50">#{ tag.tag }</p>
                                            </motion.div>
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>
                        <div className="row">
                            <div className="col-3 text-white-50 mt-4" onClick={() => onCommentClick(post.id)}>
                                <div className="hover:cursor-pointer hover:bg-gray-800 w-fit px-3">
                                    <i className="far fa-comment mr-2 inline"></i>
                                    <span className="inline">{post?.comments}</span> 
                                </div>
                            </div>
                            <div className="col-4 text-white-50 mt-4">
                                <div className="hover:cursor-pointer hover:bg-gray-800 w-fit px-2" onClick={() => navigate(`/post/${post.id}`)}>
                                    <i className="fa fa-comment mr-2 inline"></i>
                                    <span className="inline pr-3">answers {post?.answers}</span>
                                </div>
                            </div>
                            <div className="col-5 text-white-50 mt-4">
                                <p className="text-md text-white-50 inline">Posted on { moment(post.created_at).format("MMMM Do, YYYY") }</p>   
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
                    <h4>This post will be deleted.</h4>
                    <div className="flex justify-between mt-4">
                        <button onClick={() => setisDeleteOpen(false)} className="bg-gray-600 text-white font-bold py-2 px-4 rounded" type="button">
                            Cancel
                        </button>
                        <button onClick={() => deletePost(post.id)} className="bg-red-600 text-white font-bold py-2 px-4 rounded" type="button">
                            Delete
                        </button>
                    </div>
                </Modal>
                {isCommentOpen && <CommentView comments={post.comments} post={post} isHome={isHome} setIsCommentOpen={setIsCommentOpen}/>}
            </TailwindCard>
        </motion.div>
    )
}
