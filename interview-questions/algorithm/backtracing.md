# Backtracing

## Problems

- [51. N-Queens](https://leetcode.com/problems/n-queens/)

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
