# Backtracing

## Problems

- [51. N-Queens](https://leetcode.com/problems/n-queens/)
- [79. Word Search](https://leetcode.com/problems/word-search/)
- [337. House Robber III](https://leetcode.com/problems/house-robber-iii/)

### N-Queens

Input: n = 4
Output: `[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]`
Explanation: There exist two distinct solutions to the 4-queens puzzle as shown above

Input: n = 1
Output: `[["Q"]]`

Time Complexity: $O(n!)$

Space Complexity: $O(n^2)$ (ignore the output)

```ts
type State = number[]
type Choices = Set<number>

// time complexity: O(n!)
function solveNQueens(n: number): string[][] {
  const res: State[] = []

  dfs(n, [], res)

  const placements = getPlacements(n)

  return res.map((state) => state.map((idx) => placements[idx]))
}

// time complexity: O(n)
// space complexity: O(n ^ 2)
const getPlacements = (n: number): string[] => {
  const placements: string[] = []
  for (let i = 0; i < n; i++) {
    placements.push(".".repeat(i) + "Q" + ".".repeat(n - i - 1))
  }
  return placements
}

// time complexity: O(n)
// space complexity: O(n)
const getChoicesForNextRow = (n: number, state: State): Choices => {
  const choicesForNextRow = new Set(Array(n).keys())
  const currentRow = state.length
  for (const [row, placement] of state.entries()) {
    choicesForNextRow.delete(placement)
    choicesForNextRow.delete(placement - (currentRow - row)) // left
    choicesForNextRow.delete(placement + (currentRow - row)) // right
  }
  return choicesForNextRow
}

// time complexity: O(n!), n * n * (n - 2) * n * (n - 4) * n * ... * 1 *= n!
// space complexity: O(n^n), stacks(n) * choices (n)
const dfs = (n: number, state: State, res: State[]) => {
  if (state.length === n) {
    res.push([...state])
    return
  }

  const choices = getChoicesForNextRow(n, state)
  for (const choice of choices) {
    state.push(choice)
    dfs(n, state, res)
    state.pop()
  }
}
```

### House Robber III

The thief has found himself a new place for his thievery again. There is only one entrance to this area, called root.

Besides the root, each house has one and only one parent house. After a tour, the smart thief realized that all houses in this place form a binary tree. It will automatically contact the police if two directly-linked houses were broken into on the same night.

Given the root of the binary tree, return the maximum amount of money the thief can rob without alerting the police.

Input: root = [3,2,3,null,3,null,1]
Output: 7
Explanation: Maximum amount of money the thief can rob = 3 + 3 + 1 = 7.

Input: root = [3,4,5,1,3,null,1]
Output: 9
Explanation: Maximum amount of money the thief can rob = 4 + 5 = 9.

Time Complexity: $O(n)$

- n is the number of nodes in the tree
- we only visit each node once at most

Space Complexity: $O(n)$

- n is the number of nodes in the tree

```ts
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

function rob(root: TreeNode | null): number {
  const cache = new Map<TreeNode, number>()

  const f = (house: TreeNode) => {
    if (!house) {
      return 0
    }

    if (cache.has(house)) {
      return cache.get(house)
    }

    // rob this house
    const profitForRobbingTheHouse =
      house.val +
      f(house?.left?.left) +
      f(house?.left?.right) +
      f(house?.right?.left) +
      f(house?.right?.right)

    // don't rob this house
    const profitForNotRobbingTheHouse = f(house?.left) + f(house?.right)

    cache.set(
      house,
      Math.max(profitForRobbingTheHouse, profitForNotRobbingTheHouse)
    )

    return cache.get(house)
  }

  return f(root)
}
```
