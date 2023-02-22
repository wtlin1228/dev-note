The maximum safe integer in that situation is 2^31-1, or 2,147,483,647. This is because bitwise and shift operators only work on 32-bit numbers.

Max integer = 0b01111111111111111111111111111111 = 2^31 - 1 = 2147483647
Min integer = 0b10000000000000000000000000000000 = -2^31 = -2147483648

2's complement:

1 in binary is `0b00000000000000000000000000000001`
-1 in binary is `0b11111111111111111111111111111101`
so (-1 + 1) & 0xFFFFFFFF = 0
and (-x + x) & 0xFFFFFFFF = 0

bit-wise operators:

- `&` and
- `|` or
- `~` not
- `^` exclusive or, xor
- `>>` right shift
- `<<` left shift

# Count the number of ones in the binary representation of the given number

```js
function countOnes(n) {
  while (n) {
    // remove right-most 1-bit
    n = n & (n - 1)
    count++
  }
  return count
}
```

# Is power of four

```js
function isPowerOfFour(n) {
  const isPowerOfTwo = n & (n - 1 === 0)
  const isTheOnlyOneBitInTheRightPosition = n & 0x55555555

  return isPowerOfTwo && isTheOnlyOneBitInTheRightPosition
}
```

# Sum of two integers

```js
function getSum(a, b) {
  // be careful about the terminating condition;
  const sumWithoutCarry = a ^ b
  const carry = (a & b) << 1
  return carry == 0 ? sumWithoutCarry : getSum(sumWithoutCarry, carry)
}
```

# Missing number

Given an array containing n distinct numbers taken from 0, 1, 2, ..., n, find the one that is missing from the array. For example, Given nums = [0, 1, 3] return 2.

```js
function missingNumber(nums) {
  return nums.reduce((acc, curr, index) => {
    acc ^= curr
    acc ^= index + 1
    return acc
  }, nums.length + 1)
}
```

# Largest power

```js
function largestPower(n) {
  // changing all the right side bits to 1
  n = n | (n >> 1)
  n = n | (n >> 2)
  n = n | (n >> 4)
  n = n | (n >> 8)
  n = n | (n >> 16)
  // now n must be 0b11111111111111111111111111111111
  return n ^ (n >> 1)
}
```

# Reverse bits

```js

```

# reference

https://leetcode.com/problems/sum-of-two-integers/solutions/84278/a-summary-how-to-use-bit-manipulation-to-solve-problems-easily-and-efficiently/?orderBy=most_votes
