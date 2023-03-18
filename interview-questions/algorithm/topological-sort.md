# Topological Sort

## Examples

Input: Vertices=4, Edges=[3, 2], [3, 0], [2, 0], [2, 1]
Output: Following are the two valid topological sorts for the given graph:

1. 3, 2, 0, 1
2. 3, 2, 1, 0

---

Input: Vertices=5, Edges=[4, 2], [4, 3], [2, 0], [2, 1], [3, 1]
Output: Following are all valid topological sorts for the given graph:

1. 4, 2, 3, 0, 1
2. 4, 3, 2, 0, 1
3. 4, 3, 2, 1, 0
4. 4, 2, 3, 1, 0
5. 4, 2, 0, 3, 1

---

Input: Vertices=7, Edges=[6, 4], [6, 2], [5, 3], [5, 4], [3, 0], [3, 1], [3, 2], [4, 1]
Output: Following are all valid topological sorts for the given graph:

1. 5, 6, 3, 4, 0, 1, 2
2. 6, 5, 3, 4, 0, 1, 2
3. 5, 6, 4, 3, 0, 2, 1
4. 6, 5, 4, 3, 0, 1, 2
5. 5, 6, 3, 4, 0, 2, 1
6. 5, 6, 3, 4, 1, 2, 0

There are other valid topological ordering of the graph too.

## Basic Solution

1. Source: Any node that has no incoming edge and has only outgoing edges is called a source.
2. Sink: Any node that has only incoming edges and no outgoing edge is called a sink.
3. So, we can say that a topological ordering starts with one of the sources and ends at one of the sinks.
4. A topological ordering is possible only when the graph has no directed cycles, i.e. if the graph is a **Directed Acyclic Graph (DAG)**. If the graph has a cycle, some vertices will have cyclic dependencies which makes it impossible to find a linear ordering among vertices.

We can traverse the graph in a Breadth First Search (BFS) way. Put the traversed node into the result array and keep going until all vertices are visited.

```js
function topological_sort(vertices, edges) {
  const sortedOrder = []
  if (vertices <= 0) {
    return sortedOrder
  }

  // a. Initialize the graph
  const inDegree = Array(vertices).fill(0) // count of incoming edges
  const graph = Array(vertices)
    .fill()
    .map(() => []) // adjacency list graph

  // b. Build the graph
  edges.forEach((edge) => {
    const [parent, child] = edge
    graph[parent].push(child) // put the child into it's parent's list
    inDegree[child]++ // increment child's inDegree
  })

  // c. Find all sources i.e., all vertices with 0 in-degrees
  let sources = []
  for (let i = 0; i < inDegree.length; i++) {
    if (inDegree[i] === 0) {
      sources.push(i)
    }
  }

  // d. For each source, add it to the sortedOrder and subtract one from all of its children's in-degrees
  while (sources.length > 0) {
    const nextSources = []
    sources.forEach((vertex) => {
      sortedOrder.push(vertex)
      graph[vertex].forEach((child) => {
        // get the node's children to decrement their in-degrees
        inDegree[child] -= 1
        // if a child's in-degree becomes zero, add it to the sources queue
        if (inDegree[child] === 0) {
          nextSources.push(child)
        }
      })
    })
    sources = nextSources
  }

  // topological sort is not possible as the graph has a cycle
  if (sortedOrder.length !== vertices) {
    return []
  }

  return sortedOrder
}

console.log(
  `Topological sort: ${topological_sort(4, [
    [3, 2],
    [3, 0],
    [2, 0],
    [2, 1],
  ])}`
)

console.log(
  `Topological sort: ${topological_sort(5, [
    [4, 2],
    [4, 3],
    [2, 0],
    [2, 1],
    [3, 1],
  ])}`
)
console.log(
  `Topological sort: ${topological_sort(7, [
    [6, 4],
    [6, 2],
    [5, 3],
    [5, 4],
    [3, 0],
    [3, 1],
    [3, 2],
    [4, 1],
  ])}`
)
```

## Time Complexity

In step "d", each vertex will become a source only once and each edge will be accessed and removed once.

$O(V + E)$, where

- `V` is the total number of vertices
- `E` is the total number of edges in the graph.

## Space Complexity

Since we are storing all of the edges for each vertex in an adjacency list.

$O(V + E)$, where

- `V` is the total number of vertices
- `E` is the total number of edges in the graph.

## Problems

- [207. Course Schedule](https://leetcode.com/problems/course-schedule/description/)
