import {React , useState, useEffect} from 'react'
import Node from './Node.js'
import { getBFSAnimations } from '../SearchAlgorithms/searchAlgorithms.js';

const GRID_HEIGHT = 20;
const GRID_WIDTH = 30;
let start = [randomIntFromInterval(0, GRID_HEIGHT - 1), randomIntFromInterval(0, GRID_WIDTH - 1)];
let end = [randomIntFromInterval(0, GRID_HEIGHT - 1), randomIntFromInterval(0, GRID_WIDTH - 1)];
const ANIMATION_DELAY_MS = 3;
// let start = [0, 0]

// let end = [2, 2]

function SearchVisualizer () {
    const [grid, setGrid] = useState([])
    const [searchType, setSearchType] = useState('astar')

    useEffect(() => {
        initializeGrid()
    }, [])

    function initializeGrid() {
        const matrix = []
        while (start === end) {
            end = [randomIntFromInterval(0, GRID_HEIGHT - 1), randomIntFromInterval(0, GRID_WIDTH - 1)];
        }
        for (let i = 0; i < GRID_HEIGHT; i++) {
            const row = []
            for (let j = 0; j < GRID_WIDTH; j++) {
                if (i === start[0] && j === start[1]){
                    row.push({visited: false, type:"start", prev: null})
                } else if(i === end[0] && j === end[1]) {
                    row.push({visited: false, type:"end",  prev: null})
                } else {
                    row.push({visited: false, type:"path",  prev: null})
                }
            }   
            matrix.push(row)
        }
        setGrid(matrix)
    }

    function BFSSearch() {
        const animations = getBFSAnimations(start, end, grid) 
        let found = false;
        for (let i = 0; i < animations.length; i++) {
            const graphRow = document.getElementsByClassName("graph-row")
            setTimeout(() => {
                const [x, y] = animations[i]
                if (x === -1) {
                    found = true
                }
                else if(!(start[0] === x && start[1] === y)) {
                    const node = graphRow[x].children[y]
                    node.style.backgroundColor = found ? "yellow" : "blue"
                }
            }, i * ANIMATION_DELAY_MS)
        }
    }

    function search() {
        switch (searchType) {
            case "astar":
                console.log("astar")
                break;
            case "dijkstra":
                console.log("dijkstra")
                break;
            case "bfs":
                BFSSearch();
                break;
            case "dfs":
                console.log("dfs")
                break;
        }
    }

    function updateGrid(x, y) {
        const updated = [...grid]
        const updatedRow = [...updated[x]]
        updatedRow[y].visited = !updatedRow[y].visited
        updated[x] = updatedRow
        setGrid(updated)
    }
    return (
        <>  
            <label>Search Algorithm:</label>
            <select 
                onChange={(e) => setSearchType(e.target.value)}
                defaultValue="astar"
            >
                <option value="astar">A* Search</option>
                <option value="dijkstra">Dijkstra</option>
                <option value="bfs">BFS</option>
                <option value="dfs">DFS</option>
            </select>
            <button onClick={search}>Search</button>
            {grid.map((row, idx) => (
                <div 
                    className="graph-row"
                    style={{display: 'flex'}} 
                    key={idx}>
                    {row.map((col, colIdx) => (
                        <Node 
                            className="graph-node"
                            key={colIdx} 
                            visited={col.visited} 
                            type={col.type}
                            x={idx}
                            y={colIdx}
                            updateGrid={updateGrid}>    
                        </Node>
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