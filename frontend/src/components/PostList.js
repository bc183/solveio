import React from 'react'
import { useSelector } from 'react-redux'
import Post from './Post';

export default function PostList({ postList, isSearch = false }) {
    return (
        <React.Fragment>
            { postList.map((post, index) => (
                <Post isHome key={index} post={post} isSearch={isSearch}/>
            )) }
        </React.Fragment>
    )
}
