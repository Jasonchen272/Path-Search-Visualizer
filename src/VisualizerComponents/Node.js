import React from 'react'
import './Node.css'

function Node({visited}) {
    return (
        <div className='path-node'>{visited ? "1" : "0"}</div>
    )
}

export default Node