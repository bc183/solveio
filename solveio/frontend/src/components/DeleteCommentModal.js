import React from 'react'
import { customStyles } from '../css_var'
import Modal from 'react-modal';
import RingLoader from "react-spinners/RingLoader";

export default function DeleteCommentModal({ isDeleteOpen, setisDeleteOpen, deleteComment, id, loading }) {
    return (
        <Modal
            isOpen={isDeleteOpen}
            onRequestClose={() => setisDeleteOpen(false)}
            style={customStyles}
            contentLabel="Delete"
        >
            <h4>This Comment will be deleted.</h4>
            <div className="flex justify-between mt-4">
                <button onClick={() => setisDeleteOpen(false)} className="bg-gray-600 text-white font-bold py-2 px-4 rounded" type="button">
                    Cancel
                </button>
                <button onClick={() => deleteComment(id)} className="bg-red-600 text-white font-bold py-2 px-4 rounded" type="button">
                    Delete
                </button>
            </div>
            {loading && 
            <div className="flex mt-2 justify-content-center">
                <RingLoader size={40} css={"color: #4f545c; display: block; align-self: center"} />
            </div>}
        </Modal>
    )
}
