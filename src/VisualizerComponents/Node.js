import {React, useState} from 'react'
import './Node.css'

function Node({visited, type}) {
    const [hasVisited, setHasVisited] = useState(visited)

    return (
        <div className={type === 'start' ? 'start-node' : type === 'end' ? 'end-node' : 'path-node'} onMouseOver={() => {setHasVisited(!hasVisited)}}
            style={{ backgroundColor: type === 'start' ? 'green' : type === 'end' ? 'red' : hasVisited ? 'orange' : 'white' }}>
        </div>
    )
}

export default Node