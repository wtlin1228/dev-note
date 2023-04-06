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
- [134. Gas Station](https://leetcode.com/problems/gas-station/)
- [1029. Two City Scheduling](https://leetcode.com/problems/two-city-scheduling/)
- [871. Minimum Number of Refueling Stops](https://leetcode.com/problems/minimum-number-of-refueling-stops/)

### Gas Station

There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i].

You have a car with an unlimited gas tank and it costs cost[i] of gas to travel from the ith station to its next (i + 1)th station. You begin the journey with an empty tank at one of the gas stations.

Given two integer arrays gas and cost, return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return -1. If there exists a solution, it is guaranteed to be unique

Example 1:

Input: gas = [1,2,3,4,5], cost = [3,4,5,1,2]
Output: 3
Explanation:
Start at station 3 (index 3) and fill up with 4 unit of gas. Your tank = 0 + 4 = 4
Travel to station 4. Your tank = 4 - 1 + 5 = 8
Travel to station 0. Your tank = 8 - 2 + 1 = 7
Travel to station 1. Your tank = 7 - 3 + 2 = 6
Travel to station 2. Your tank = 6 - 4 + 3 = 5
Travel to station 3. The cost is 5. Your gas is just enough to travel back to station 3.
Therefore, return 3 as the starting index.

Example 2:

Input: gas = [2,3,4], cost = [3,4,3]
Output: -1
Explanation:
You can't start at station 0 or 1, as there is not enough gas to travel to the next station.
Let's start at station 2 and fill up with 4 unit of gas. Your tank = 0 + 4 = 4
Travel to station 0. Your tank = 4 - 3 + 2 = 3
Travel to station 1. Your tank = 3 - 3 + 3 = 3
You cannot travel back to station 2, as it requires 4 unit of gas but you only have 3.
Therefore, you can't travel around the circuit once no matter where you start.

---

In the one pass, we have proved that Ns -> N0 is reachable.
But we need to prove that N0 -> Ns is also reachable with the starting station Ns.

Assume there is a station k (0 < k < Ns) that is not reachable from Ns.

The condition `total tank >= 0` could be written as `F(0, N - 1) >= 0`.

Let's split the sum by the starting station Ns and the unreachable station k.

`F(0, k - 1) + F(k, Ns - 1) + F(Ns, N - 1) >= 0`

And the second term `F(k, Ns - 1)` couldn't be positive or Ns wouldn't be the starting station.

So we got:

`F(0, k - 1) + F(Ns, N - 1) >= 0` ... (1)

At the same time, k is unreachable from Ns.

So we got:

`F(Ns, N - 1) + F(0, k - 1) < 0` ... (2)

Equations (1) and (2) together result in a contraction.
Therefore, there is no unreachable station k between 0 to Ns.
And the answer is unique according to the problem definition.

---

Time Complexity: O(N), one pass

Space Complexity: O(1)

```ts
function canCompleteCircuit(gas: number[], cost: number[]): number {
  const stationCount = gas.length
  let totalTank = 0
  let currentGas = 0
  let startStation = 0
  for (let i = 0; i < stationCount; i++) {
    totalTank += gas[i] - cost[i]
    currentGas += gas[i] - cost[i]
    if (currentGas < 0) {
      startStation = i + 1
      currentGas = 0
    }
  }
  return totalTank >= 0 ? startStation : -1
}
```

### Minimum Number of Refueling Stops

Time Complexity: $O(nlogn)$

- n is the stations count
- `heap.pop()` take O(n) time

Space Complexity: $O(n)$

- n is the stations count
- store each gas into the heap

```rust
use std::collections::BinaryHeap;

fn min_refuel_stops(target: i32, start_fuel: i32, stations: Vec<Vec<i32>>) -> i32 {
    let mut heap: BinaryHeap<i32> = BinaryHeap::new();
    let mut current_fuel = start_fuel;
    let mut refuel_stops = 0;

    for station in &stations {
        let position = station[0];
        let fuel = station[1];

        while current_fuel < position {
            if let Some(fuel) = heap.pop() {
                current_fuel += fuel;
                refuel_stops += 1;
            } else {
                return -1;
            }
        }

        heap.push(fuel);
    }

    while current_fuel < target {
        if let Some(fuel) = heap.pop() {
            current_fuel += fuel;
            refuel_stops += 1;
        } else {
            return -1;
        }
    }

    refuel_stops
}

fn main() {
    let refuel = min_refuel_stops(
        100,
        10,
        vec![vec![10, 60], vec![20, 30], vec![30, 30], vec![60, 40]],
    );
    println!("refuel: {}", refuel)
}
```
