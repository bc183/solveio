import React from 'react'
import SimpleEditor from './SimpleEditor'
import TailwindCard from './TailwindCard'
import RingLoader from "react-spinners/RingLoader";
import { motion } from 'framer-motion';


export default function PostForm({ title, description, code, setCode, successLabel, loading, handleSuccess, disabled, handleDescriptionChange, handleTitleChange, noTitle = false, noTags = false, setTags, tags }) {
    return (
        <motion.div initial={{ x: -700 }} animate={{ x:0 }} className="mt-4">
            <TailwindCard bgClass="bg-dark">
                {!noTitle && <div className="mb-4">
                    <label className="block text-white font-bold mb-2" htmlFor="title">
                        Title
                    </label>
                    <input className="shadow appearance-none border rounded w-11/12 py-2 px-3 text-grey-darker mb-3" value={title.value} id="title" type="text" placeholder="Title" onChange={handleTitleChange}></input>
                    {title.error && <p className="text-red-600 text-xs italic"> {title.error} </p>}
                </div>}
                <div className="mb-4">
                    <label className="block text-white font-bold mb-2" htmlFor="description">
                        Description
                    </label>
                    <textarea rows={10} className="shadow appearance-none border rounded w-11/12 py-2 px-3 text-grey-darker mb-3" value={description.value} id="description" type="text" onChange={handleDescriptionChange}></textarea>
                    {description.error && <p className="text-red-600 text-xs italic"> {description.error} </p>}
                </div>
                <div className="mb-4">
                    <label className="block text-white font-bold mb-2" htmlFor="description">
                        Code <span className="text-sm text-white-50">(optional)</span>
                    </label>
                    <SimpleEditor className="shadow appearance-none border rounded w-11/12 py-2 px-3 text-grey-darker mb-3" code={code} setCode={setCode}/>
                </div>
                {!noTags && <div className="mb-4">
                    <label className="block text-white font-bold mb-2" htmlFor="tags">
                        Tags <span className="text-sm text-white-50">(optional) enter tags seperated by space.</span>
                    </label>
                    <input className="shadow appearance-none border rounded w-11/12 py-2 px-3 text-grey-darker mb-3" value={tags} id="tags" type="text" placeholder="Tags" onChange={(e) => setTags(e.target.value)}></input>
                </div>}
                <div className="flex items-center justify-between">
                    <button onClick={handleSuccess} disabled={disabled} className={`${disabled ? "bg-blue-200": "bg-blue-600"} text-white font-bold py-2 px-4 rounded`} type="button">
                        {successLabel}
                    </button>
                    { loading && <RingLoader size={40} css={"color: #4f545c; display: inline;"} /> }
                </div>
            </TailwindCard>
        </motion.div>
    )
}
