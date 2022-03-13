import React from 'react'

export default function TailwindCard({ children, bgClass }) {
    return (
        <div className={`${bgClass} shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col`}>
            { children }
        </div>
    )
}
