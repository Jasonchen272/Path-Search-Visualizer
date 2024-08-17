import {React} from 'react'
import './Node.css'

function Node({type, x, y}) {
    return (
        <div 
            className={type === 'start' ? 'start-node' : type === 'end' ? 'end-node' : 'path-node'} 
            id= {`${x},${y}`}>
        </div>
    )
}

export default Node
