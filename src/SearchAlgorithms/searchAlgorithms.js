export function getBFSAnimations(start, end, graph) {
    const animations = [];
    const path = [start]

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