# Backtracing

## Problems

- [51. N-Queens](https://leetcode.com/problems/n-queens/)
- [79. Word Search](https://leetcode.com/problems/word-search/)
- [337. House Robber III](https://leetcode.com/problems/house-robber-iii/)
- [93. Restore IP Addresses](https://leetcode.com/problems/restore-ip-addresses/)
- [37. Sudoku Solver](https://leetcode.com/problems/sudoku-solver/)
- [473. Matchsticks to Square](https://leetcode.com/problems/matchsticks-to-square/)
- [247. Strobogrammatic Number II](https://leetcode.com/problems/strobogrammatic-number-ii/)

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

```ts
// Definition for a binary tree node.
class TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val
    this.left = left === undefined ? null : left
    this.right = right === undefined ? null : right
  }
}
```

Approach 1: DFS + Cache

Time Complexity: $O(n)$

- n is the number of nodes in the tree
- we only visit each node once at most

Space Complexity: $O(n)$

- n is the number of nodes in the tree

```ts
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

Approach 2: DFS + backtracking

Time Complexity: $O(n)$

- n is the number of nodes in the tree
- we only visit each node once at most

Space Complexity: $O(h)$

- h is the height of the tree

```ts
function rob(root: TreeNode | null): number {
  const dfs = (house: TreeNode): [number, number] => {
    if (!house) {
      return [0, 0]
    }

    const [notRobLeft, robLeft] = dfs(house.left)
    const [notRobRight, robRight] = dfs(house.right)

    const notRobThis =
      Math.max(notRobLeft, robLeft) + Math.max(notRobRight, robRight)
    const robThis = house.val + notRobLeft + notRobRight

    return [notRobThis, robThis]
  }

  const [notRobRoot, robRoot] = dfs(root)
  return Math.max(notRobRoot, robRoot)
}
```

### Sudoku Solver

Time Complexity: $O((9!)^9)$

Space Complexity: $O(1)$

- each candidates map takes $O(81)$

```ts
type CandidatesMap = Map<number, Set<string>>

const getGridIdx = (rowIdx: number, colIdx: number) =>
  Math.floor(rowIdx / 3) * 3 + Math.floor(colIdx / 3)

const numbers = Array.from({ length: 9 }, (_, idx) => String(idx + 1))

const createCandidatesMap = (): CandidatesMap =>
  new Map(Array.from({ length: 9 }, (_, idx) => [idx, new Set(numbers)]))

/**
 Do not return anything, modify board in-place instead.
 */
function solveSudoku(board: string[][]): void {
  const rowCandidates = createCandidatesMap()
  const colCandidates = createCandidatesMap()
  const gridCandidates = createCandidatesMap()

  for (let [rowIdx, row] of board.entries()) {
    for (let [colIdx, char] of row.entries()) {
      if (char !== ".") {
        rowCandidates.get(rowIdx).delete(char)
        colCandidates.get(colIdx).delete(char)
        const gridIdx = getGridIdx(rowIdx, colIdx)
        gridCandidates.get(gridIdx).delete(char)
      }
    }
  }

  let isDone = false

  const backtracing = (
    board: string[][],
    row: number,
    col: number,
    rowCandidates: CandidatesMap,
    colCandidates: CandidatesMap,
    gridCandidates: CandidatesMap
  ) => {
    if (isDone) {
      return
    }

    while (row < 9 && board[row][col] !== ".") {
      col += 1
      if (col === 9) {
        row += 1
        col = 0
      }
    }

    if (row === 9) {
      isDone = true
      return
    }

    for (let i = 1; i <= 9; i++) {
      const char = String(i)
      if (
        rowCandidates.get(row).has(char) &&
        colCandidates.get(col).has(char) &&
        gridCandidates.get(getGridIdx(row, col)).has(char)
      ) {
        board[row][col] = char
        rowCandidates.get(row).delete(char)
        colCandidates.get(col).delete(char)
        gridCandidates.get(getGridIdx(row, col)).delete(char)
        backtracing(
          board,
          row,
          col,
          rowCandidates,
          colCandidates,
          gridCandidates
        )
        if (!isDone) {
          board[row][col] = "."
          rowCandidates.get(row).add(char)
          colCandidates.get(col).add(char)
          gridCandidates.get(getGridIdx(row, col)).add(char)
        }
      }
    }
  }

  backtracing(board, 0, 0, rowCandidates, colCandidates, gridCandidates)
}
```

### Matchsticks to Square

You are given an integer array matchsticks where matchsticks[i] is the length of the ith matchstick. You want to use all the matchsticks to make one square. You should not break any stick, but you can link them up, and each matchstick must be used exactly one time.

Return true if you can make this square and false otherwise.

Example 1:

Input: matchsticks = [1,1,2,2,2]
Output: true
Explanation: You can form a square with length 2, one side of the square came two sticks with length 1.

Example 2:

Input: matchsticks = [3,3,3,3,4]
Output: false
Explanation: You cannot find a way to form a square with all the matchsticks.

Time Complexity: $O(4^n)$

Space Complexity: $O(n)$, for recursive call stacks

```ts
function makesquare(matchsticks) {
  if (matchsticks.length < 4) {
    return false
  }

  const sum = matchsticks.reduce((acc, curr) => acc + curr, 0)

  if (sum % 4 !== 0) {
    return false
  }

  const side = sum / 4

  for (let matchstick of matchsticks) {
    if (matchstick > side) {
      return false
    }
  }

  const backtracing = (sides = [0, 0, 0, 0], stickIdx = 0) => {
    if (stickIdx === matchsticks.length) {
      return (
        sides[0] === sides[1] && sides[1] === sides[2] && sides[2] === sides[3]
      )
    }

    for (let i = 0; i < sides.length; i++) {
      sides[i] += matchsticks[stickIdx]
      if (sides[i] <= side) {
        if (backtracing(sides, stickIdx + 1)) {
          return true
        }
      }
      sides[i] -= matchsticks[stickIdx]
    }
    return false
  }

  matchsticks.sort((a, b) => b - a)
  return backtracing()
}
```

### Strobogrammatic Number II

Given an integer n, return all the strobogrammatic numbers that are of length n. You may return the answer in any order.

A strobogrammatic number is a number that looks the same when rotated 180 degrees (looked at upside down).

Example 1:

Input: n = 2
Output: ["11","69","88","96"]
Example 2:

Input: n = 1
Output: ["0","1","8"]

Constraints:

1 <= n <= 14

---

Time Complexity: $O((5 ^ (n / 2) + 1) * n)$

Space Complexity: $O(n / 2)$

- maximum level = (n / 2) + 1
- branches = 5 (1, 6, 8, 9, 0)

---

```ts
const MAP = {
  "1": "1",
  "6": "9",
  "8": "8",
  "9": "6",
  "0": "0",
}

function recursion(
  res: string[],
  count: number,
  isOdd: boolean,
  acc: string[]
) {
  if (acc[0] === "0") {
    // number with leading-zero is not allowed
    return
  }

  if (count === 0) {
    const leftPart = acc.join("")
    const rightPart = [...acc]
      .reverse()
      .map((x) => MAP[x])
      .join("")
    if (isOdd) {
      ;["0", "1", "8"].forEach((mid) => {
        res.push(leftPart + mid + rightPart)
      })
    } else {
      res.push(leftPart + rightPart)
    }
    return
  }

  ;["0", "1", "6", "8", "9"].forEach((x) => {
    acc.push(x)
    recursion(res, count - 1, isOdd, acc)
    acc.pop()
  })
}

function findStrobogrammatic(n: number): string[] {
  if (n === 1) {
    return ["0", "1", "8"]
  }

  const res = []
  recursion(res, Math.floor(n / 2), n % 2 === 1, [])
  return res
}
```
