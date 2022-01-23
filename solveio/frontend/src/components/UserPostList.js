import { motion } from 'framer-motion';
import React from 'react'
import Post from './Post';

export default function UserPostList({ postList }) {
    return (
        <motion.div initial={{ x: -200 }} animate={{ x:0 }}>
            { postList.map((post, index) => (
                <Post isHome key={index} post={post} isUserPost />
            )) }
        </motion.div>
    )
}
