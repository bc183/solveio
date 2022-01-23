import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PostList from '../components/PostList';
import HashLoader from "react-spinners/HashLoader";
import { motion } from "framer-motion";
import 'highlight.js/styles/github.css';
import { Link } from 'react-router-dom';
import PopularUsers from '../components/PopularUsers';
import TrendingTags from '../components/TrendingTags';
import { getSearchList } from '../redux/actions/searchListAction';
import { PAGINATION_COUNT } from '../redux/constants/paginationConstants';

export default function SearchView() {

    const [page, setPage] = useState(1);

    const { searchTerm } = useSelector(state => state.search)

    const { searchList, errorMessage, loading } = useSelector(state => state.searchList);

    const dispatch = useDispatch();
    useEffect(() => {
        if (searchTerm?.length >= 2) {
            setPage(1);
            dispatch(getSearchList(page, searchTerm));
        }
    }, [dispatch, searchTerm]);

    useEffect(() => {
        if (searchTerm?.length >= 2 && page > 1) {
            dispatch(getSearchList(page, searchTerm));
        }
    }, [page]);

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
                        <h4 className="text-white-50 inline">Search Results for {searchTerm} </h4>
                    </div>
                    <PostList postList={searchList} isSearch />
                    {searchList?.length > 0 && !errorMessage && (searchList?.length % PAGINATION_COUNT) === 0 && <h5 className='text-white-50 text-center font-semibold hover:cursor-pointer mb-4' onClick={() => setPage(page + 1)}>{"Load more..."}</h5>}
                    { (searchList?.length % PAGINATION_COUNT) < PAGINATION_COUNT && (searchList?.length % PAGINATION_COUNT) !== 0 &&  <h5 className='text-white-50 text-center font-semibold hover:cursor-poi nter mb-4'>{"You are all caught up."}</h5>}
                    {searchList?.length === 0 && <h5 className='text-white-50 text-center font-semibold mb-4'>{errorMessage ? errorMessage: "No posts to show."}</h5>}
                </motion.div>
                <TrendingTags />
            </div>}
        </div>
    )
}
