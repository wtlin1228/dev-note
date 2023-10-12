# KMP (Knuth–Morris–Pratt)

In computer science, the Knuth–Morris–Pratt algorithm (or KMP algorithm) is a string-searching algorithm that searches for occurrences of a "word" W within a main "text string" S by employing the observation that when a mismatch occurs, the word itself embodies sufficient information to determine where the next match could begin, thus bypassing re-examination of previously matched characters.

See https://en.wikipedia.org/wiki/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm

## Complexity Analysis

- Build LPS for string takes O(n) time, where n is the length of string
- `indexOf(haystack, needle)` takes O(n + m) time, where n is size of haystack and m is the size of needle

## Implementation

1. Build longest prefix suffix table

```ts
function buildLPS(s: string): number[] {
  const lps = Array(s.length).fill(0)
  let ptr = 0
  let i = 1
  while (i < s.length) {
    if (s[i] === s[ptr]) {
      lps[i] = ptr + 1
      i += 1
      ptr += 1
    } else if (ptr === 0) {
      lps[i] = 0
      i += 1
    } else {
      ptr = lps[ptr - 1]
    }
  }
  return lps
}
```

2. Do the comparison

```ts
function indexOf(haystack: string, needle: string): number {
  const lps = buildLPS(needle)
  let i = 0
  let j = 0
  while (i < haystack.length) {
    if (haystack[i] === needle[j]) {
      i += 1
      j += 1
    } else if (j === 0) {
      i += 1
    } else {
      j = lps[j - 1]
    }
    if (j === needle.length) {
      return i - j
    }
  }
  return -1
}
```

## Problems

- [796. Rotate String](https://leetcode.com/problems/rotate-string/)
