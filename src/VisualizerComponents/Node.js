import {React} from 'react'
import './Node.css'

function Node({type, x, y}) {
    return (
        <div 
            className={type === 'start' ? 'start-node' : type === 'end' ? 'end-node' : 'path-node'} 
            id= {`${x},${y}`}
            style={{ backgroundColor: type === 'start' ? 'green' : type === 'end' ? 'red' : '#F5EDED' }}>
        </div>
    )
}

export default Node
