import React from 'react';
import Modal from 'react-modal';
import RingLoader from "react-spinners/RingLoader";
import { customStyles } from '../css_var';

export default function UpdateCommentModal({ open, setOpen, comment, handleCommentChange, updateComment, loading }) {

    return (
        <Modal
            isOpen={open}
            onRequestClose={() => setOpen(false)}
            style={customStyles}
            contentLabel="Update Comment"
        >
            <div className="mb-4">
                <label className="block text-white text-sm font-bold mb-2" htmlFor="comment">
                    Update Comment
                </label>
                <input className="shadow appearance-none inline bg-gray-600 border rounded w-10/12 py-2 px-3 text-white mb-3" value={comment.value} id="comment" type="text" placeholder="comment" onChange={(event) => handleCommentChange(event, comment.id)}></input>
                <i onClick={updateComment} className={`${comment.value === "" ?  "text-gray-400": "hover:cursor-pointer text-green-300"} far fa-check-circle mx-2 text-gray-400`}></i>
                {comment.error && <p className="text-red-600 text-xs italic"> {comment.error} </p>}
            </div>
            {loading && 
            <div className="flex mt-2 justify-content-center">
                <RingLoader size={40} css={"color: #4f545c; display: block; align-self: center"} />
            </div>}
        </Modal>
    )
}
