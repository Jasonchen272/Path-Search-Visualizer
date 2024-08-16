import {React, useState} from 'react'
import './Node.css'

function Node({visited, type, x, y, updateGrid}) {
    const [hasVisited, setHasVisited] = useState(visited)
    function updateVisited() {
        setHasVisited(!hasVisited);
        updateGrid(x, y, hasVisited)

    }

    return (
        <div className={type === 'start' ? 'start-node' : type === 'end' ? 'end-node' : 'path-node'} onMouseOver={() => {updateVisited(!hasVisited)}}
            style={{ backgroundColor: type === 'start' ? 'green' : type === 'end' ? 'red' : hasVisited ? 'black' : 'white' }}>
        </div>
    )
}

export default Node