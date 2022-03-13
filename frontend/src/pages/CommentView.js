import React from 'react'
import CommentList from '../components/CommentList'

export default function CommentView({ comments, post, isHome, answer, setIsCommentOpen, isUserAnswer }) {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                </div>
                <div className="col-12">
                    <CommentList isUserAnswer={isUserAnswer} comments={comments} post={post} answer={answer} setIsCommentOpen={setIsCommentOpen} isHome={isHome}/>
                </div>
            </div>
        </div>
    )
}
