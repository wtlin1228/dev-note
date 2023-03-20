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

- [207. Course Schedule](https://leetcode.com/problems/course-schedule/)
- [210. Course Schedule II](https://leetcode.com/problems/course-schedule-ii/)
- All Course Schedule Orders - Same as above, but return all order instead of any
- [269. Alien Dictionary](https://leetcode.com/problems/alien-dictionary/)
- [444. Sequence Reconstruction](https://leetcode.com/problems/sequence-reconstruction/)
- [310. Minimum Height Trees](https://leetcode.com/problems/minimum-height-trees/)

### All Course Schedule Orders

Input: Tasks=6, Prerequisites=[2, 5], [0, 5], [0, 4], [1, 4], [3, 2], [1, 3]
Output:

1. [0, 1, 4, 3, 2, 5]
2. [0, 1, 3, 4, 2, 5]
3. [0, 1, 3, 2, 4, 5]
4. [0, 1, 3, 2, 5, 4]
5. [1, 0, 3, 4, 2, 5]
6. [1, 0, 3, 2, 4, 5]
7. [1, 0, 3, 2, 5, 4]
8. [1, 0, 4, 3, 2, 5]
9. [1, 3, 0, 2, 4, 5]
10. [1, 3, 0, 2, 5, 4]
11. [1, 3, 0, 4, 2, 5]
12. [1, 3, 2, 0, 5, 4]
13. [1, 3, 2, 0, 4, 5]

Time Complexity: $O(V! * E)$

Space Complexity: $O(V! + V^2 + E)$

- $V!$ for all combination
- $V^2$ for sources in all stacks
- $E$ for the graph

```js
/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {number[]}
 */
var findAllOrder = function (numCourses, prerequisites) {
  if (numCourses <= 0) {
    return []
  }

  const inDegree = Array(numCourses).fill(0)
  const graph = Array(numCourses)
    .fill()
    .map(() => [])

  prerequisites.forEach(([parent, child]) => {
    graph[parent].push(child)
    inDegree[child] += 1
  })

  const sources = inDegree.reduce((acc, curr, idx) => {
    if (curr === 0) {
      acc.push(idx)
    }
    return acc
  }, [])

  const allSorts = []
  findAllTopologicalSorts(allSorts, graph, inDegree, sources)
  return allSorts
}

const findAllTopologicalSorts = (
  res,
  graph,
  inDegree,
  sources,
  sortedOrder = []
) => {
  if (sources.length > 0) {
    sources.forEach((vertex) => {
      sortedOrder.push(vertex)

      const sourcesForNextCall = sources.reduce((acc, curr) => {
        if (curr !== vertex) {
          acc.push(curr)
        }
        return acc
      }, [])

      graph[vertex].forEach((child) => {
        inDegree[child] -= 1
        if (inDegree[child] === 0) {
          sourcesForNextCall.push(child)
        }
      })

      findAllTopologicalSorts(
        res,
        graph,
        inDegree,
        sourcesForNextCall,
        sortedOrder
      )

      sortedOrder.pop()
      graph[vertex].forEach((child) => {
        inDegree[child] += 1
      })
    })
  }

  if (sortedOrder.length === inDegree.length) {
    res.push([...sortedOrder])
  }
}

console.log("Task Orders: ")
console.log(
  findAllOrder(3, [
    [0, 1],
    [1, 2],
  ])
)

console.log("Task Orders: ")
console.log(
  findAllOrder(4, [
    [3, 2],
    [3, 0],
    [2, 0],
    [2, 1],
  ])
)

console.log("Task Orders: ")
console.log(
  findAllOrder(6, [
    [2, 5],
    [0, 5],
    [0, 4],
    [1, 4],
    [3, 2],
    [1, 3],
  ])
)
```

### Alien Dictionary

There is a new alien language that uses the English alphabet. However, the order among the letters is unknown to you.

You are given a list of strings words from the alien language's dictionary, where the strings in words are sorted lexicographically by the rules of this new language.

Return a string of the unique letters in the new alien language sorted in lexicographically increasing order by the new language's rules. If there is no solution, return "". If there are multiple solutions, return any of them.

Example 1:

Input: words = ["wrt","wrf","er","ett","rftt"]
Output: "wertf"
Example 2:

Input: words = ["z","x"]
Output: "zx"
Example 3:

Input: words = ["z","x","z"]
Output: ""
Explanation: The order is invalid, so return "".

Time Complexity:

- parseWords takes $O(L)$, where

  - L is the overall length of words

- topological sort takes $O(V! * E)$, where

  - `V` is the total number of vertices
  - `E` is the total number of edges in the graph.

Space Complexity: $O(V + E)$

```ts
function alienOrder(words: string[]): string {
  const { inDegree, graph } = parseWords(words)

  let sources = []
  for (const [key, value] of inDegree) {
    if (value === 0) {
      sources.push(key)
    }
  }

  let res = ""
  while (sources.length > 0) {
    const nextSources: string[] = []

    sources.forEach((char) => {
      res += char
      for (const child of graph.get(char)) {
        inDegree.set(child, inDegree.get(child) - 1)
        if (inDegree.get(child) === 0) {
          nextSources.push(child)
        }
      }
    })

    sources = nextSources
  }

  if (res.length !== inDegree.size) {
    return ""
  }

  return res
}

const parseWords = (
  words: string[]
): {
  inDegree: Map<string, number>
  graph: Map<string, Set<string>>
} => {
  // Time Complexity: O(L), where L is the length of all words
  const charSet = words.reduce<Set<string>>((acc, curr) => {
    for (const char of curr) {
      acc.add(char)
    }
    return acc
  }, new Set())

  const inDegree = new Map<string, number>()
  const graph = new Map<string, Set<string>>()
  for (const char of charSet) {
    inDegree.set(char, 0)
    graph.set(char, new Set())
  }

  // Time Complexity: O(L), where L is the length of all words
  let prevWord = words[0]
  for (let i = 1; i < words.length; i++) {
    const currWord = words[i]

    if (currWord.startsWith(prevWord)) {
      continue
    }

    let ptr = 0
    while (prevWord[ptr] === currWord[ptr]) {
      ptr += 1
    }

    const parent = prevWord[ptr]
    const child = currWord[ptr]

    if (!graph.get(parent).has(child)) {
      inDegree.set(child, inDegree.get(child) + 1)
      graph.get(parent).add(child)
    }

    prevWord = currWord
  }

  return {
    inDegree,
    graph,
  }
}
```

### Sequence Reconstruction

time complexity: $O(V + E)$

- each vertex will become a source only once and each edge will be accessed and removed once

space complexity: $O(V + E)$

- V is nums.length. we have nums.length vertexes
- E is edges, at most V ^ 2

```ts
function sequenceReconstruction(
  nums: number[],
  sequences: number[][]
): boolean {
  const n = nums.length

  const inDegree = Array(n + 1).fill(0)
  const graph = Array(n + 1)
    .fill(0)
    .map(() => new Set<number>())

  sequences.forEach((sequence) => {
    let prev = sequence[0]
    for (let i = 1; i < sequence.length; i++) {
      const curr = sequence[i]
      const childSet = graph[prev]
      if (!childSet.has(curr)) {
        childSet.add(curr)
        inDegree[curr] += 1
      }
      prev = curr
    }
  })

  let sources: number[] = []
  for (let i = 1; i <= n; i++) {
    if (inDegree[i] === 0) {
      sources.push(i)
    }
  }

  let res = []
  while (sources.length === 1) {
    const source = sources[0]
    res.push(source)

    const nextSources = []
    for (const child of graph[source]) {
      inDegree[child] -= 1
      if (inDegree[child] === 0) {
        nextSources.push(child)
      }
    }

    sources = nextSources
  }

  return res.length === n
}
```

### Minimum Height Trees

Let $|V|$ be the number of nodes in the graph, then the number of edges would be $|V| - 1$ as specified in the problem.

time complexity: $O(|V|)$

space complexity: $O(|V|)$

```ts
function findMinHeightTrees(n: number, edges: number[][]): number[] {
  if (n <= 2) {
    return Array(n)
      .fill(0)
      .map((_, i) => i)
  }

  const graph = Array(n)
    .fill(0)
    .map(() => new Set<number>())
  for (const [left, right] of edges) {
    graph[left].add(right)
    graph[right].add(left)
  }

  // find all leaves
  let leaves = graph.reduce<number[]>((acc, curr, idx) => {
    if (curr.size === 1) {
      acc.push(idx)
    }
    return acc
  }, [])

  let remainingNodes = n

  while (remainingNodes > 2) {
    remainingNodes -= leaves.length

    const nextLeaves = []
    for (const node of leaves) {
      for (const neighbor of graph[node]) {
        graph[neighbor].delete(node)
        if (graph[neighbor].size === 1) {
          nextLeaves.push(neighbor)
        }
      }
    }
    leaves = nextLeaves
  }

  return leaves
}
```
