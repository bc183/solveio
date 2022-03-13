import React from 'react';
import Answer from './Answer';
import { motion } from 'framer-motion';

export default function UserAnswerList({ answerList }) {

    return (
        <motion.div initial={{ x: -200 }} animate={{ x:0 }}>
            {answerList?.map((answer, index) => (
               <Answer answer={answer} key={index} isUserAnswer />
            ))}
        </motion.div>
    )
}
