# Union Find

Union find is useful in the [connected components](<https://en.wikipedia.org/wiki/Component_(graph_theory)>) problems.

By maintaining the parent of each vertex in the graph, we can union(merge) each vertex by finding their parent first.

## pseudo code

```
for each edge of edges:
  1. find parents of the nodes on the edge
  2. union the two parents
```

## implementation

```js
class UnionFind {
  // space complexity: O(N)
  constructor(nodeCount, edges) {
    this.par = []
    this.rank = []
    this.init(nodeCount)

    this.count = this.countConnectedComponents(nodeCount, edges)
  }

  init(nodeCount) {
    for (let i = 0; i < nodeCount; i++) {
      this.par.push(i) // point to the node itself
      this.rank.push(1) // initial rank is all 1
    }
  }

  // time complexity: O(1)
  find(node) {
    while (node !== this.par[node]) {
      this.par[node] = this.par[this.par[node]]
      node = this.par[node]
    }
    return node
  }

  // time complexity: O(1)
  union(n1, n2) {
    let parent1 = this.find(n1)
    let parent2 = this.find(n2)

    if (parent1 === parent2) {
      return 0
    }

    if (this.rank[parent1] < this.rank[parent2]) {
      ;[parent1, parent2] = [parent2, parent1]
    }
    this.par[parent2] = parent1
    this.rank[parent1] += this.rank[parent2]

    return 1
  }

  countConnectedComponents(nodeCount, edges) {
    let res = nodeCount
    for (let [n1, n2] of edges) {
      res -= this.union(n1, n2)
    }
    return res
  }
}
```

## Problems

- [323. Number of Connected Components in an Undirected Graph](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/description/)
- [200. Number of Islands](https://leetcode.com/problems/number-of-islands/description/)
