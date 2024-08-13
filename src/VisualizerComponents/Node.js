import {React, useState} from 'react'
import './Node.css'

function Node({visited}) {
    const [hasVisited, setHasVisited] = useState(visited)
    return (
        <div className='path-node' onMouseOver={() => {setHasVisited(!hasVisited)}}
            style={{ backgroundColor: hasVisited ? 'orange' : 'white' }}>
        </div>
    )
}

export default Node