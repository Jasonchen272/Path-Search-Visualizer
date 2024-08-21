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
            if (testBounds(x, y, graph) && !graph[x][y].visited && graph[x][y].type !== 'wall') {
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
            if (testBounds(neighbor[0], neighbor[1], graph)  && !graph[neighbor[0]][neighbor[1]].visited && graph[neighbor[0]][neighbor[1]].type !== 'wall') {
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

//=================== DFS =====================
export function getDFSAnimations(start, end, graph) {
    const animations = [];

    if (graph.length === 0) {
        return animations;
    }
    const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    const stack = [];
    stack.push(start);
    while (stack.length !== 0) {
        const cur = stack.pop();
        const x = cur[0];
        const y = cur[1];

        for (let direction of directions) {
            const newX = direction[0] + x;
            const newY = direction[1] + y;
            if (testBounds(newX, newY, graph) && !graph[newX][newY].visited && graph[newX][newY].type !== 'wall')  {
                graph[newX][newY].prev = [x, y];
                stack.push([newX, newY]);
                graph[x][y].visited = true;
                animations.push([x, y]);
            }
            if (newX === end[0] && newY === end[1]) {
                addPath(start, end, animations, graph);
                return animations
            }
        }
        
    }
    return animations;
}

// =============== Dijkstra ================

class MinHeap {
    constructor() {
        this.heap = [];
        this.positions = new Map();
    }

    insert(node, priority) {
        this.heap.push({ node, priority });
        this.positions.set(node, this.heap.length - 1);
        this.bubbleUp(this.heap.length - 1);
    }

    extractMin() {
        const min = this.heap[0];
        const end = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = end;
            this.positions.set(end.node, 0);
            this.bubbleDown(0);
        }
        this.positions.delete(min.node);
        return min;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    bubbleUp(index) {
        const element = this.heap[index];
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            const parent = this.heap[parentIndex];
            if (element.priority >= parent.priority) break;
            this.heap[index] = parent;
            this.positions.set(parent.node, index);
            index = parentIndex;
        }
        this.heap[index] = element;
        this.positions.set(element.node, index);
    }

    bubbleDown(index) {
        const length = this.heap.length;
        const element = this.heap[index];
        while (true) {
            const leftChildIndex = 2 * index + 1;
            const rightChildIndex = 2 * index + 2;
            let swap = null;

            if (leftChildIndex < length) {
                const leftChild = this.heap[leftChildIndex];
                if (leftChild.priority < element.priority) {
                    swap = leftChildIndex;
                }
            }

            if (rightChildIndex < length) {
                const rightChild = this.heap[rightChildIndex];
                if (
                    (swap === null && rightChild.priority < element.priority) ||
                    (swap !== null && rightChild.priority < this.heap[swap].priority)
                ) {
                    swap = rightChildIndex;
                }
            }

            if (swap === null) break;
            this.heap[index] = this.heap[swap];
            this.positions.set(this.heap[index].node, index);
            index = swap;
        }
        this.heap[index] = element;
        this.positions.set(element.node, index);
    }
}


export function getDijkstraAnimations(start, end, graph) {
    const animations = []
    const distances = {};
    const priorityQueue = new MinHeap();
    const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];

    for (let i = 0; i < graph.length; i++) {
        for (const node in graph[i]) {
            distances[`${i},${node}`] = Infinity;
        }
    }
    distances[start] = 0;

    priorityQueue.insert(start, 0);

    while (!priorityQueue.isEmpty()) {
        const { node: currentNode, priority: currentDistance } = priorityQueue.extractMin();

        // If the current distance is greater than the recorded distance, skip processing
        if (currentDistance > distances[currentNode[0] + "," + currentNode[1]]) {
            continue;
        }
        // Update distances for each neighbor
        for (const direction of directions) {
            const newX = direction[0] + currentNode[0];
            const newY = direction[1] + currentNode[1];
            const distance = currentDistance + 1; // All edges have the same weight (1)
            if (newX === end[0] && newY === end[1]) {
                graph[newX][newY].prev = [currentNode[0], currentNode[1]];
                addPath(start, end, animations, graph);
                return animations
            }

            // If a shorter path is found
            if (distance < distances[newX + "," + newY] && testBounds(newX, newY, graph) && !graph[newX][newY].visited && graph[newX][newY].type !== 'wall') {
                graph[newX][newY].prev = [currentNode[0], currentNode[1]];
                graph[currentNode[0]][currentNode[1]].visited = true;
                animations.push([newX, newY]);
                distances[newX + "," + newY] = distance;
                priorityQueue.insert([newX, newY], distance);
            }
        }
    }
    return animations;
}