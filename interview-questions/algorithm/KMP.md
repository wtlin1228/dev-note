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

## Rust

https://doc.rust-lang.org/std/str/pattern/trait.Pattern.html

---

How I solve the problem https://exercism.org/tracks/rust/exercises/sublist with KMP.

```rust
#[derive(Debug, PartialEq, Eq)]
pub enum Comparison {
    Equal,
    Sublist,
    Superlist,
    Unequal,
}

pub fn is_contain<T: PartialEq>(haystack: &[T], needle: &[T]) -> bool {
    // phase 1: build the LSP
    let mut lsp = vec![0; needle.len()];
    let mut ptr = 0;
    let mut i = 1;
    while i < needle.len() {
        if needle[i] == needle[ptr] {
            lsp[i] = ptr + 1;
            i += 1;
            ptr += 1;
        } else if ptr == 0 {
            lsp[i] = 0;
            i += 1;
        } else {
            ptr = lsp[ptr - 1];
        }
    }

    // phase 2: find needle from the haystack
    ptr = 0;
    i = 0;
    while i < haystack.len() {
        if haystack[i] == needle[ptr] {
            i += 1;
            ptr += 1;
        } else if ptr == 0 {
            i += 1;
        } else {
            ptr = lsp[ptr - 1];
        }

        if ptr == needle.len() {
            return true;
        }
    }

    false
}

pub fn sublist<T: PartialEq>(_first_list: &[T], _second_list: &[T]) -> Comparison {
    if _first_list.len() == _second_list.len() {
        for i in 0.._first_list.len() {
            if _first_list[i] != _second_list[i] {
                return Comparison::Unequal;
            }
        }
        return Comparison::Equal;
    } else if _first_list.len() == 0 {
        return Comparison::Sublist;
    } else if _second_list.len() == 0 {
        return Comparison::Superlist;
    } else if _first_list.len() > _second_list.len() {
        if is_contain(_first_list, _second_list) {
            return Comparison::Superlist;
        } else {
            return Comparison::Unequal;
        }
    } else {
        if is_contain(_second_list, _first_list) {
            return Comparison::Sublist;
        } else {
            return Comparison::Unequal;
        }
    }
}

fn main() {
    assert_eq!(sublist(&[()], &[()]), Comparison::Equal);
    assert_eq!(sublist(&[1, 2, 3], &[1, 2, 3]), Comparison::Equal);
    assert_eq!(sublist(&[1, 2, 3], &[1, 2, 4]), Comparison::Unequal);
    assert_eq!(
        sublist(&[1, 2, 3], &[1, 1, 1, 2, 2, 1, 2, 2, 3, 1, 2, 3]),
        Comparison::Sublist
    );
    assert_eq!(
        sublist(&[1, 2, 3], &[1, 1, 1, 2, 2, 1, 2, 2, 3, 1, 2, 5]),
        Comparison::Unequal
    );
    assert_eq!(
        sublist(&[1, 1, 1, 2, 2, 1, 2, 2, 3, 1, 2, 3], &[1, 2, 3]),
        Comparison::Superlist
    );
    assert_eq!(
        sublist(&[1, 1, 1, 2, 2, 1, 2, 2, 3, 1, 2, 5], &[1, 2, 3]),
        Comparison::Unequal
    );
}

```

## Problems

- [796. Rotate String](https://leetcode.com/problems/rotate-string/)
