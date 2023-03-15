# Trie (prefix tree / digital tree)

There are various applications of this data structure, such as autocomplete and spellchecker.

```js
class Node {
  constructor() {
    this.isEnd = false
    this.next = new Map()
  }
}

class Trie {
  constructor() {
    this.root = new Node()
  }

  /**
   * O(m), where m is the word length
   * @param {string} word
   * @return {void}
   */
  insert(word) {
    let ptr = this.root
    for (const c of word) {
      if (!ptr.next.has(c)) {
        ptr.next.set(c, new Node())
      }
      ptr = ptr.next.get(c)
    }
    ptr.isEnd = true
  }

  /**
   * O(m), where m is the word length
   * @param {string} word
   * @return {Node}
   */
  getNode(word) {
    let ptr = this.root
    for (const c of word) {
      if (!ptr.next.has(c)) {
        return null
      }
      ptr = ptr.next.get(c)
    }
    return ptr
  }

  /**
   * O(m), where m is the word length
   * @param {string} word
   * @return {boolean}
   */
  search(word) {
    const node = this.getNode(word)
    return node !== null && node.isEnd
  }

  /**
   * O(m), where m is the prefix length
   * @param {string} prefix
   * @return {boolean}
   */
  startsWith(prefix) {
    const node = this.getNode(prefix)
    return node !== null
  }
}
```

## Problems

- [208. Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree/)
- [211. Design Add and Search Words Data Structure](https://leetcode.com/problems/design-add-and-search-words-data-structure/)
- [212. Word Search II](https://leetcode.com/problems/word-search-ii/)
