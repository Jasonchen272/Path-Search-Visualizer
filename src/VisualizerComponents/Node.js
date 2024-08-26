import {React} from 'react'
import './Node.css'

function Node({type, x, y}) {
    type === 'start' ? console.log(type) : console.log()

    return (
        <div 
            className={type === 'start' ? 'start-node' : type === 'end' ? 'end-node' : 'path-node'} 
            id= {`${x},${y}`}
            style={{border: type === 'start' ? "blue solid" : 'solid'}}>
        </div>
    )
}

export default Node
