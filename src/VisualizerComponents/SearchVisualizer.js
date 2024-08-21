import {React , useState, useEffect} from 'react'
import Node from './Node.js'
import './Node.css'
import { getBFSAnimations, getAStarAnimations, getDFSAnimations, getDijkstraAnimations } from '../SearchAlgorithms/searchAlgorithms.js';

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
    const [erase, setErase] = useState(false)
    const [player, setPlayer] = useState(start)

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
        let animations = [];
        switch (searchType) {
            case "astar":
                animations = getAStarAnimations(start, end, grid);
                break;
            case "dijkstra":
                animations = getDijkstraAnimations(start, end, grid);
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
                    node.style.backgroundColor = found ? "#C3A17F" : "#7FA1C3"
                }
            }, i * ANIMATION_DELAY_MS)
        }
    }

    function randomMaze() {
        reset()
        for (let i = 0; i < GRID_HEIGHT * GRID_HEIGHT * 0.6; i++) {
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
        if ((x === start[0] && y === start[1]) || (x === end[0] && y === end[1])) {
            return;
        }
        const updated = [...grid]
        const updatedRow = [...updated[x]]
        updatedRow[y].visited = visited
        updated[x] = updatedRow
        setGrid(updated)
        const node = document.getElementsByClassName('graph-row')[x].children[y]
        node.style.backgroundColor = visited ? 'black' : '#F5EDED'
    }

    function testBounds(x, y) {
        return x < GRID_HEIGHT && x >= 0 && y < GRID_WIDTH && y >= 0
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            let [x, y] = player;
            let [newX, newY] = player;
            event.preventDefault();
            switch(event.key) {
                case "w":
                    if (testBounds(x - 1, y)) {
                        newX = x - 1
                    }
                    break;
                case "a":
                    if (testBounds(x, y - 1)) {
                        newY = y - 1
                    }
                    break;
                case "s":
                    if (testBounds(x + 1, y)) {
                        newX = x + 1
                    }
                    break;
                case "d":
                    if (testBounds(x, y + 1)) {
                        newY = y + 1
                    }
                    break;
                default:

            }
            setPlayer([newX, newY])
            document.getElementsByClassName('graph-row')[newX].children[newY].style.border = "blue solid";
            document.getElementsByClassName('graph-row')[x].children[y].style.border = "solid";

        };


        document.addEventListener('keydown', handleKeyDown);

        // Cleanup function to remove the event listener on component unmount
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [player]);  // Dependency array includes 'player'

    return (
        <>  
            <h1 className="header-title">Path Visualizer</h1>
            <div className="sub-header">
                <label>Search Algorithm:</label>

                <div className="algo-select" style={{width: "200px"}}>
                    <select 
                        onChange={(e) => setSearchType(e.target.value)}
                        defaultValue="astar"
                    >
                        <option value="astar">A* Search</option>
                        <option value="dijkstra">Dijkstra</option>
                        <option value="bfs">BFS</option>
                        <option value="dfs">DFS</option>
                    </select>
                </div>
                <div className="btns">
                    <button onClick={search}>Search</button>
                    <button onClick={reset}>Reset Grid</button>
                    <button onClick={randomMaze}>Randomize</button>
                    <button onClick={() => setErase(!erase)}>{erase ? "Erase  ✔" : "Erase X"}</button>
                </div>
            </div>
            <div
                onMouseDown={() => setDraggable(true)}
                onMouseMove={(e) => {
                    if (draggable) {
                        let id = e.target.id.split(",");
                        let [x, y] = id;
                        updateGrid(parseInt(x), parseInt(y), !erase)
                    }
                }}
                onMouseUp={() => setDraggable(false)}
                onMouseLeave={() => setDraggable(false)}
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