import React, { useEffect, useState } from 'react';
import PopularUsers from '../components/PopularUsers';
import TrendingTags from '../components/TrendingTags';
import HashLoader from "react-spinners/HashLoader";
import { useParams } from 'react-router';
import axiosInstance from '../axios/axiosInstance';
import User from '../components/User';
import { useDispatch, useSelector } from 'react-redux';
import { getUserPostsList } from '../redux/actions/userPostListActions';
import UserPostList from '../components/UserPostList';
import { PAGINATION_COUNT } from '../redux/constants/paginationConstants';
import TailwindCard from '../components/TailwindCard';
import { motion } from 'framer-motion';
import { getUserAnswerList } from '../redux/actions/userAnswerListActions';
import UserAnswerList from '../components/UserAnswerList';

export default function ViewUser() {
    const { id } = useParams();
    const [IsQuestion, setIsQuestion] = useState(true);
    const [answerPage, setAnswerPage] = useState(1);
    const [questionPage, setQuestionPage] = useState(1);
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(false);

    const dispatch = useDispatch();

    const { userPostList, loading: userPostLoading, errorMessage: userPostErrorMessage } = useSelector(state => state.userPostList);
    const { userAnswerList, loading: userAnswerLoading, errorMessage: userAnswerErrorMessage } = useSelector(state => state.userAnswerList);


    const getUser = async () => {
        try {
            setUserLoading(true);
            const response = await axiosInstance.get(`users/${id}`);
            setUser(response.data);
            setUserLoading(false);
        } catch (error) {
            setUserLoading(false);
            console.log(error);
        }
    }

    useEffect(() => {
        getUser();
        setQuestionPage(1);
        setAnswerPage(1)
    }, [id, dispatch]);

    useEffect(() => {
        if (!IsQuestion) {
            dispatch(getUserAnswerList(answerPage, id));
        }
    }, [user, dispatch, answerPage, IsQuestion])

    useEffect(() => {
        if (IsQuestion) {
            dispatch(getUserPostsList(questionPage, id));
        }
    }, [user, dispatch, questionPage, IsQuestion])

    return (
        <div className="container-fluid background-home">
            {userLoading && 
                <div className="flex justify-content-center align-items-center pt-40">
                    <HashLoader size={100} color='gray'/>
                </div>
            }
            <div className="row">
                <PopularUsers />
                <div className="col-12 col-md-6 mt-3">
                    {!userLoading && <React.Fragment>
                        <div className="flex justify-between mb-3">
                            <h4 className="text-white-50 inline">{user?.user_name}</h4>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <User user={user} />
                            </div>
                            <div className="col-12">
                                <div className={`bg-dark shadow-md rounded pt-2 px-2 mb-4 flex flex-col`}>
                                    <div className="flex">
                                        <p className={`${IsQuestion && "bg-black"} hover:cursor-pointer p-2 font-semibold text-white-50 mr-4`} onClick={() => setIsQuestion(true)}>Questions</p>
                                        <p className={`${!IsQuestion && "bg-black"} font-semibold text-white-50 p-2 hover:cursor-pointer`} onClick={() => setIsQuestion(false)}>Answers</p>
                                    </div>
                                </div>
                            </div>
                            {IsQuestion && 
                            <div className="col-12">
                                {userPostLoading && 
                                    <div className="flex justify-center">
                                        <HashLoader size={100} color='gray'/>
                                    </div>
                                }
                            
                                {!userPostLoading && 
                                    <div className="flex justify-between mb-3">
                                        <h4 className="text-white-50 inline">Questions asked.</h4>
                                    </div>}
                                {!userPostLoading && <UserPostList postList={userPostList} />}
                                {!userPostLoading && userPostList?.length > 0 && !userPostErrorMessage && (userPostList?.length % PAGINATION_COUNT) === 0 && <h5 className='text-white-50 text-center font-semibold hover:cursor-pointer mb-4' onClick={() => setQuestionPage(questionPage + 1)}>{"Load more..."}</h5>}
                                {!userPostLoading && (userPostList?.length % PAGINATION_COUNT) < PAGINATION_COUNT && (userPostList?.length % PAGINATION_COUNT) !== 0 &&  <h5 className='text-white-50 text-center font-semibold hover:cursor-poi nter mb-4'>{"You are all caught up."}</h5>}
                                {!userPostLoading && userPostList?.length === 0 && <h5 className='text-white-50 text-center font-semibold mb-4'>{userPostErrorMessage ? userPostErrorMessage: "No posts to show."}</h5>}
                            </div>}
                            {!IsQuestion && 
                            <div className="col-12">
                                {userAnswerLoading && 
                                    <div className="flex justify-center">
                                        <HashLoader size={100} color='gray'/>
                                    </div>
                                }
                            
                                {!userAnswerLoading && 
                                    <div className="flex justify-between mb-3">
                                        <h4 className="text-white-50 inline">Answers Posted.</h4>
                                    </div>}
                                {!userAnswerLoading && <UserAnswerList answerList={userAnswerList} />}
                                {!userAnswerLoading && userAnswerList?.length > 0 && !userAnswerErrorMessage && (userAnswerList?.length % PAGINATION_COUNT) === 0 && <h5 className='text-white-50 text-center font-semibold hover:cursor-pointer mb-4' onClick={() => setAnswerPage(answerPage + 1)}>{"Load more..."}</h5>}
                                {!userAnswerLoading && (userAnswerList?.length % PAGINATION_COUNT) < PAGINATION_COUNT && (userAnswerList?.length % PAGINATION_COUNT) !== 0 &&  <h5 className='text-white-50 text-center font-semibold hover:cursor-poi nter mb-4'>{"You are all caught up."}</h5>}
                                {!userAnswerLoading && userAnswerList?.length === 0 && <h5 className='text-white-50 text-center font-semibold mb-4'>{userAnswerErrorMessage ? userAnswerErrorMessage: "No asnwers to show."}</h5>}
                            </div>}
                        </div>
                    </React.Fragment>}
                </div>
                <TrendingTags />
            </div>
        </div>
            )
}
