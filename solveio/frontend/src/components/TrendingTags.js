import React, { useEffect, useState } from 'react'
import axiosInstance from '../axios/axiosInstance';
import TailwindCard from './TailwindCard';
import HashLoader from "react-spinners/HashLoader";
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { SET_SEARCH_TERM } from '../redux/constants/searchConstants';
import { useNavigate } from 'react-router';

export default function TrendingTags() {
    const [trendingTags, setTrendingTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getTrendingTags = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("get-trending-tags/");
            setTrendingTags(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setErrorMessage(error);
            console.log(error);
        }
    }

    const getTagPosts = (tag) => {
        dispatch({ type: SET_SEARCH_TERM, payload: `#${tag.tag}`});
        navigate("/search");
    }


    useEffect(() => {
        getTrendingTags();
    }, []);

    return (
        <motion.div className="d-none d-md-block col-md-3 mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {loading && 
            <div className="flex justify-content-center align-items-center pt-40">
                <HashLoader size={100} color='gray'/>
            </div>}
            {!loading && <div className="mb-4">
                <h4 className="text-white-50 inline">Trending tags.</h4>
            </div>}
            {!loading && <TailwindCard bgClass="bg-dark">
                    <div>
                        <div className="row">
                {trendingTags?.map((tag, index) => (
                            tag.no_of_posts > 0 && <div className="col-6" key={index}>
                                <motion.div whileHover={{ scale: 1.05 }} onClick={() => getTagPosts(tag)} className="hover:cursor-pointer bg-gray-800 w-fit px-1 shadow">
                                    <p className="text-white-50">#{ tag.tag } { tag.no_of_posts }</p>
                                </motion.div>
                            </div>))}
                        </div>
                    </div>
                )
            </TailwindCard>} 
        </motion.div>
    )
}
