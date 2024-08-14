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
                path.push([x, y])
                animations.push([x, y])
                if (x === end[0] && y === end[1]) {
                    return animations;
                }
                graph[x][y].visited = true;
                q.push([x, y])
            }
        }
    }
    return false;
}

function testBounds(x, y, graph) {
    return x < graph.length && x >= 0 && y < graph[0].length && y >= 0
}