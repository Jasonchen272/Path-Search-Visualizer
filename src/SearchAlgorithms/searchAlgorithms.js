//===================== BFS =====================
export function getBFSAnimations(start, end, graph) {
    const animations = [];

    if (graph.length === 0) {
        return animations
    }
    const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    const q = []
    q.push(start)
    while (q.length !== 0) {
        const cur = q[0]
        q.shift()
        for (let direction of directions) {
            const x = direction[0] + cur[0] 
            const y = direction[1] + cur[1]
            if (testBounds(x, y, graph) && !graph[x][y].visited) {
                graph[x][y].prev = cur;
                if (x === end[0] && y === end[1]) {
                    addPath(start, end, animations, graph);
                    return animations;
                }
                animations.push([x, y])
                graph[x][y].visited = true;
                q.push([x, y])
            }
        }
    }
    return animations;
}

function addPath(start, end, animations, graph) {
    const path = graph[end[0]][end[1]].prev
    let curX = path[0]
    let curY = path[1]
    let cur = graph[curX][curY].prev
    animations.push([-1, -1])
    const shortest = []


    while (curX !== start[0] || curY !== start[1]) {
        shortest.push([curX, curY])
        curX = cur[0]
        curY = cur[1]
        cur = graph[curX][curY].prev
    }

    for (let i = shortest.length - 1; i >= 0; i--) {
        animations.push(shortest[i])
    }
}

function testBounds(x, y, graph) {
    return x < graph.length && x >= 0 && y < graph[0].length && y >= 0
}

//===================== AStar =====================
class PriorityQueue {
    constructor() {
        this.elements = [];
    }

    enqueue(priority, element) {
        this.elements.push({ priority, element });
        this.elements.sort((a, b) => a.priority - b.priority);
    }

    dequeue() {
        return this.elements.shift().element;
    }

    isEmpty() {
        return this.elements.length === 0;
    }
}

function dist(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

export function getAStarAnimations(start, end, graph) {
    const animations = []
    const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    const openSet = new PriorityQueue();
    openSet.enqueue(0, start);


    //map of {'new x, newy' : [old x, old y]}
    const prev = {};
    //map of {'new x, new y': cost from start}
    const cost = {};
    //cost zero from start
    cost[`${start[0]},${start[1]}`] = 0;

    while (!openSet.isEmpty()) {
        const current = openSet.dequeue();

        if (current[0] === end[0] && current[1] === end[1]) {
            // find path and add to animations

            //marks to animate path
            animations.push([-1, -1])
            const path = [];
            let temp = current;
            while (temp) {
                path.push(temp);
                temp = prev[`${temp[0]},${temp[1]}`];
            }

            for (let i = path.length - 1; i > 0; i--) {
                animations.push([path[i][0], path[i][1]])
            }
            return animations;
        }

        for (const direction of directions) {
            const neighbor = [current[0] + direction[0], current[1] + direction[1]];


            // Check if the neighbor is within bounds and visited
            if (testBounds(neighbor[0], neighbor[1], graph)  && !graph[neighbor[0]][neighbor[1]].visited) {
                // cost if this path chosen
                const newCost = cost[`${current[0]},${current[1]}`] + 1;

                const key = `${neighbor[0]},${neighbor[1]}`;
                if (!(key in cost) || newCost < cost[key]) {
                    if (!(neighbor[0] === end[0]) || !(neighbor[1] === end[1])) animations.push([neighbor[0], neighbor[1]]);
                    prev[key] = current;
                    cost[key] = newCost;

                    //add neighbor in pq with prioritty going to nodes closer to end
                    const fCost = newCost + dist([neighbor[0], neighbor[1]], end);

                    openSet.enqueue(fCost, [neighbor[0], neighbor[1]]);
                }
            }
        }
    }

    // No path found
    return animations;


}