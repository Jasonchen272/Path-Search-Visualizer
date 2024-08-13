import {React , useState, useEffect} from 'react'
import Node from './Node.js'

function SearchVisualizer () {
    const [grid, setGrid] = useState([])

    useEffect(() => {
        initializeGrid()
    }, [])

    function initializeGrid() {
        const matrix = []
        for (let i = 0; i < 20; i++) {
            const row = []
            for (let j = 0; j < 30; j++) {
                if (i === 0 && j === 0){
                    row.push({visited: false, type:"start"})
                } else if(i === 9 && j === 9) {
                    row.push({visited: false, type:"end"})
                } else {
                    row.push({visited: false, type:"path"})
                }
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
                        <Node key={colIdx} visited={col.visited} type={col.type}></Node>
                    ))}
                </div>
            ))}
        </>
        
    )
}

export default SearchVisualizer