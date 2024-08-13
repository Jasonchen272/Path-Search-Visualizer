import {React , useState, useEffect} from 'react'
import Node from './Node.js'

const GRID_HEIGHT = 20;
const GRID_WIDTH = 30;

function SearchVisualizer () {
    const [grid, setGrid] = useState([])

    useEffect(() => {
        initializeGrid()
    }, [])

    function initializeGrid() {
        const matrix = []
        let start = [randomIntFromInterval(0, GRID_HEIGHT), randomIntFromInterval(0, GRID_WIDTH)];
        let end = [randomIntFromInterval(0, GRID_HEIGHT), randomIntFromInterval(0, GRID_WIDTH)];
        while (start === end) {
            end = [randomIntFromInterval(0, GRID_HEIGHT), randomIntFromInterval(0, GRID_WIDTH)];
        }
        for (let i = 0; i < GRID_HEIGHT; i++) {
            const row = []
            for (let j = 0; j < GRID_WIDTH; j++) {
                if (i === start[0] && j === start[1]){
                    row.push({visited: false, type:"start"})
                } else if(i === end[0] && j === end[1]) {
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

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export default SearchVisualizer