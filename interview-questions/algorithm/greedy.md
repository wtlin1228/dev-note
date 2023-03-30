# Greedy

An algorithm is a series of steps used to solve a problem. There are multiple types of problem solving algorithms, with greedy algorithms being one of them. Greedy is an algorithmic paradigm that builds up a solution piece by piece. This means it chooses the next piece that offers the most obvious and immediate benefit. A greedy algorithm, as the name implies, always makes the choice that seems to be the best at the time. It makes a locally-optimal choice in the hope that it will lead to a globally optimal solution. In other words, greedy algorithms are used to solve optimization problems.

Greedy algorithms work by recursively constructing a solution from the smallest possible constituent parts. A recursion is an approach to problem-solving in which the solution to a particular problem depends on solutions to smaller instances of the same problem. While this technique might seem to result in the best solution, greedy algorithms have the downside of getting stuck in local optima and generally do not return the global best solution. There are a number of problems that use the greedy technique to find the solution, especially in the networking domain, where this approach is used to solve problems such as the traveling salesman problem and Prim’s minimum spanning tree algorithm.

## Does my problem match this pattern?

- Yes, if selecting a series of local optima allows us to construct or identify the globally optimum solution.
- No, if any of these conditions is fulfilled:
  - Our analysis shows that making local greedy choices lead us to a sub-optimal solution.
  - The problem has no local optima.
  - It isn’t an optimization problem.

## Problems

- [55. Jump Game](https://leetcode.com/problems/jump-game/)
- [881. Boats to Save People](https://leetcode.com/problems/boats-to-save-people/)
