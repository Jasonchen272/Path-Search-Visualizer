import {React , useState, useEffect} from 'react'
import Node from './Node.js'
import { getBFSAnimations, getAStarAnimations, getDFSAnimations } from '../SearchAlgorithms/searchAlgorithms.js';

const GRID_HEIGHT = 30;
const GRID_WIDTH = 63;
let start = [randomIntFromInterval(0, GRID_HEIGHT - 1), randomIntFromInterval(0, GRID_WIDTH - 1)];
let end = [randomIntFromInterval(0, GRID_HEIGHT - 1), randomIntFromInterval(0, GRID_WIDTH - 1)];

const ANIMATION_DELAY_MS = 3;
// let start = [0, 0]

// let end = [2, 2]

function SearchVisualizer () {
    const [grid, setGrid] = useState([])
    const [searchType, setSearchType] = useState('astar');
    const [draggable, setDraggable] = useState(false);

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

    function search() {
        let animations;
        switch (searchType) {
            case "astar":
                animations = getAStarAnimations(start, end, grid);
                break;
            case "dijkstra":
                break;
            case "bfs":
                animations = getBFSAnimations(start, end, grid) 
                break;
            case "dfs":
                animations = getDFSAnimations(start, end, grid) 
                break;
            default:
                animations = getAStarAnimations(start, end, grid);
        }
        let found = false;
        for (let i = 0; i < animations.length; i++) {
            const graphRow = document.getElementsByClassName("graph-row")
            setTimeout(() => {
                const [x, y] = animations[i]
                if (x === -1) {
                    found = true;
                } else if(!(start[0] === x && start[1] === y)) {
                    const node = graphRow[x].children[y]
                    node.style.backgroundColor = found ? "orange" : "blue"
                }
            }, i * ANIMATION_DELAY_MS)
        }
    }

    function randomMaze() {
        reset()
        for (let i = 0; i < GRID_HEIGHT * GRID_HEIGHT * 0.5; i++) {
            let x = randomIntFromInterval(0, GRID_HEIGHT - 1)
            let y = randomIntFromInterval(0, GRID_WIDTH - 1)
            while (grid[x][y].type !== 'path' || grid[x][y].visited) {
                x = randomIntFromInterval(0, GRID_HEIGHT - 1)
                y = randomIntFromInterval(0, GRID_WIDTH - 1)
            }
            updateGrid(x, y, true)
        }
    }

    function reset() {
        for (let i = 0; i < GRID_HEIGHT; i++) {
            for (let j = 0; j < GRID_WIDTH; j ++){
                if (!(i === start[0] && j === start[1]) && !(i === end[0] && j === end[1]))
                updateGrid(i, j, false)
            }
        }
    }

    function updateGrid(x, y, visited) {
        if ((x == start[0] && y == start[1]) || x == end[0] && y == end[1]) {
            return;
        }
        const updated = [...grid]
        const updatedRow = [...updated[x]]
        updatedRow[y].visited = visited
        updated[x] = updatedRow
        setGrid(updated)
        const node = document.getElementsByClassName('graph-row')[x].children[y]
        node.style.backgroundColor = updatedRow[y].visited ? 'black' : 'white'
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
            <button onClick={reset}>Reset Grid</button>
            <button onClick={randomMaze}>Randomize</button>
            <div
                onMouseDown={() => setDraggable(true)}
                onMouseMove={(e) => {
                    if (draggable) {
                        let id = e.target.id.split(",");
                        let x = id[0], y = id[1];
                        updateGrid(x, y, true)
                    }
                }}
                onMouseUp={() => setDraggable(false)}
            >
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
            </div>
        </>
        
    )
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export default SearchVisualizer