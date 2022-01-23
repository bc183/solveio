import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { vote } from '../redux/actions/voteActions';

export default function Vote({ post, type, isSearch, isUserPost, isUserAnswer }) {

    const { isLoggedIn } = useSelector(state => state.user)
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const sendVote = (value) => {
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }
        dispatch(vote({ postId: post.id, value: value, type: type, isSearch, isUserPost, isUserAnswer }));
    }

    return (
        <div className="col-1">
            <i onClick={() => sendVote(1)} className={`${isLoggedIn && post.user_vote === 1 ? "text-green-500": "text-white"} fas fa-chevron-up fa-2x  block hover:cursor-pointer`}></i>
            <p className="font-bold text-2xl text-white px-2 mt-3">{post.rating}</p>
            <i onClick={() => sendVote(-1)} className={`${isLoggedIn && post.user_vote === -1 ? "text-red-500": "text-white"} fas fa-chevron-down fa-2x  hover:cursor-pointer inline`}></i>
        </div>
    )
}
