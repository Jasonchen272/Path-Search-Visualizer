import {React, useState} from 'react'
import './Node.css'

function Node({visited}) {
    const [hasVisited, setHasVisited] = useState(visited)
    return (
        <div className='path-node' onMouseOver={() => {setHasVisited(!hasVisited)}}>{hasVisited ? "1" : "0"}</div>
    )
}

export default Node