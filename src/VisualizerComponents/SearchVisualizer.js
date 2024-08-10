import {React , useState, useEffect} from 'react'
import Node from './Node.js'

function SearchVisualizer () {
    const [grid, setGrid] = useState([])

    useEffect(() => {
        initializeGrid()
    }, [])

    function initializeGrid() {
        const matrix = []
        for (let i = 0; i < 10; i++) {
            const row = []
            for (let j = 0; j < 10; j++) {
                row.push({visited: false})
            }   
            matrix.push(row)
        }
        setGrid(matrix)
    }

    return (
    <>
        {grid.map((row, idx) => (
            <div style={{display: 'flex'}} key={idx}>
                {row.map((col, colIdx) => (
                    <Node key={colIdx} visited={col.visited}></Node>
                ))}
            </div>
        ))}
    </>
        
    )
}

export default SearchVisualizer