import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import AnswerList from '../components/AnswerList';
import Post from '../components/Post'
import { motion } from 'framer-motion';
import { getPost } from '../redux/actions/postActions';
import PopularUsers from '../components/PopularUsers';
import HashLoader from "react-spinners/HashLoader";
import TrendingTags from '../components/TrendingTags';

export default function PostView() {
    const { id } = useParams();
    const { post, loading } = useSelector(state => state.post ?? {}); 
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getPost(id));
    }, []);
    return (
        <div className="container-fluid background-home">
            <div className="row">
                <PopularUsers />
                <div className="col-12 col-md-6 mt-2">
                    {loading && 
                    <div className="flex justify-content-center align-items-center pt-40">
                        <HashLoader size={100} color='gray'/>
                    </div>}
                    {!loading && <h4 className="text-white-50 mb-4">Posted by {post?.user?.user_name}</h4>}
                    {post && 
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Post post={post} />
                    </motion.div>}
                    <div className="flex justify-between mb-3">
                        {!loading && 
                        <React.Fragment>
                            <h4 className="text-white-50 inline">Add an answer to this question.</h4>
                            <Link to={`/answer/create/${post?.id}`} className="bg-gray-600 text-white-50 ml-2 text-white font-bold p-2 rounded" type="button">
                                <i className="fa fa-plus"></i>
                            </Link>
                        </React.Fragment>}
                    </div>
                    { post?.answers > 0 && 
                    <motion.div initial={{ y: 200 }} animate={{ y: 0 }}>
                        <h3 className="font-semibold text-white my-2">Answers</h3>
                        <AnswerList postId={post?.id} />
                    </motion.div>}
                </div>
                <TrendingTags />
            </div>
        </div>
    )
}
