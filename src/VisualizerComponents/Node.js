import {React, useState} from 'react'
import './Node.css'

function Node({visited, type, x, y, updateGrid}) {
    const [hasVisited, setHasVisited] = useState(visited)
    return (
        <div 
            className={type === 'start' ? 'start-node' : type === 'end' ? 'end-node' : 'path-node'} 
            id= {`${x},${y}`}
            style={{ backgroundColor: type === 'start' ? 'green' : type === 'end' ? 'red' : 'white' }}>
        </div>
    )
}

export default Node
