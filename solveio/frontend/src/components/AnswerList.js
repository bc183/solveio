import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAnswersList } from '../redux/actions/answerListActions';
import HashLoader from "react-spinners/HashLoader";
import Answer from './Answer';
import { PAGINATION_COUNT } from '../redux/constants/paginationConstants';

export default function AnswerList({ postId }) {

    const [page, setPage] = useState(1);
    const dispatch = useDispatch();
    const { loading, answerList, errorMessage } = useSelector(state => state.answerList);

    useEffect(() => {
        dispatch(getAnswersList(page, postId));
    }, [page, dispatch]);

    return (
        <React.Fragment>
            {loading && 
            <div className="flex justify-content-center align-items-center pt-40">
                <HashLoader size={100} color='gray'/>
            </div>}
            { !loading && answerList?.map((answer, index) => (
               <Answer answer={answer} key={index}/>
            )) }
            {answerList?.length > 0 && !errorMessage && (answerList?.length % PAGINATION_COUNT) === 0 && <h5 className='text-white-50 text-center font-semibold hover:cursor-pointer mb-4' onClick={() => setPage(page + 1)}>{"Load more..."}</h5>}
            { (answerList?.length % PAGINATION_COUNT) < PAGINATION_COUNT && (answerList?.length % PAGINATION_COUNT) !== 0 &&  <h5 className='text-white-50 text-center font-semibold hover:cursor-pointer mb-4'>{"You are all caught up."}</h5>}
            {answerList?.length === 0 && <h5 className='text-white-50 text-center font-semibold mb-4'>{errorMessage ? errorMessage: "No posts to show."}</h5>}
        </React.Fragment>

    )
}
