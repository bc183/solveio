import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PostList from '../components/PostList';
import HashLoader from "react-spinners/HashLoader";
import { getPostsList } from '../redux/actions/postsListActions';
import { motion } from "framer-motion";
import 'highlight.js/styles/github.css';
import { Link } from 'react-router-dom';
import PopularUsers from '../components/PopularUsers';
import TrendingTags from '../components/TrendingTags';
import { PAGINATION_COUNT } from '../redux/constants/paginationConstants';

export default function Home() {

    const [page, setPage] = useState(1);

    const { postList, errorMessage, loading } = useSelector(state => state.postList);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getPostsList(page));
    }, [page, dispatch]);

    return (
        <div className="container-fluid background-home">
            {loading && 
            <div className="flex justify-content-center align-items-center pt-40">
                <HashLoader size={100} color='gray'/>
            </div>}
            {!loading && <div className="row">
                <PopularUsers />
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}  className="col-12 col-md-6 mt-3">
                    <div className="flex justify-between mb-3">
                        <h4 className="text-white-50 inline">Stuck somewhere ? Ask the solve.io community.</h4>
                        <Link to="/post/create" className="bg-gray-600 text-white-50 ml-2 text-white font-bold p-2 rounded" type="button">
                            <i className="fa fa-plus"></i>
                        </Link>
                    </div>
                    <PostList postList={postList} />
                    {postList?.length > 0 && !errorMessage && (postList?.length % PAGINATION_COUNT) === 0 && <h5 className='text-white-50 text-center font-semibold hover:cursor-pointer mb-4' onClick={() => setPage(page + 1)}>{"Load more..."}</h5>}
                    { (postList?.length % PAGINATION_COUNT) < PAGINATION_COUNT && (postList?.length % PAGINATION_COUNT) !== 0 &&  <h5 className='text-white-50 text-center font-semibold hover:cursor-pointer mb-4'>{"You are all caught up."}</h5>}
                    {postList?.length === 0 && <h5 className='text-white-50 text-center font-semibold mb-4'>{errorMessage ? errorMessage: "No posts to show."}</h5>}
                </motion.div>
                <TrendingTags />
            </div>}
        </div>
    )
}
