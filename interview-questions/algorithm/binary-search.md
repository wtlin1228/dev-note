## Problems

- [222. Count Complete Tree Nodes](https://leetcode.com/problems/count-complete-tree-nodes/)

### Count Complete Tree Nodes

```rust
use std::cell::RefCell;
use std::rc::Rc;

// Definition for a binary tree node.
#[derive(Debug, PartialEq, Eq)]
pub struct TreeNode {
    pub val: i32,
    pub left: Option<Rc<RefCell<TreeNode>>>,
    pub right: Option<Rc<RefCell<TreeNode>>>,
}

impl TreeNode {
    #[inline]
    pub fn new(val: i32) -> Self {
        TreeNode {
            val,
            left: None,
            right: None,
        }
    }
}

pub struct Solution;

impl Solution {
    fn get_left_depth(node: &Option<Rc<RefCell<TreeNode>>>) -> u32 {
        match node {
            Some(n) => 1 + Self::get_left_depth(&n.as_ref().borrow().left),
            None => 0,
        }
    }

    fn get_right_depth(node: &Option<Rc<RefCell<TreeNode>>>) -> u32 {
        match node {
            Some(n) => 1 + Self::get_right_depth(&n.as_ref().borrow().right),
            None => 0,
        }
    }

    fn is_nth_leaf_live(
        nth: u32,
        remaining_steps: u32,
        node: &Option<Rc<RefCell<TreeNode>>>,
    ) -> bool {
        if remaining_steps == 0 {
            return node.is_some();
        }
        let right = 2_u32.pow(remaining_steps - 1);
        match nth >= right {
            true => Self::is_nth_leaf_live(
                nth - right,
                remaining_steps - 1,
                &node.as_ref().unwrap().as_ref().borrow().right,
            ),
            false => Self::is_nth_leaf_live(
                nth,
                remaining_steps - 1,
                &node.as_ref().unwrap().as_ref().borrow().left,
            ),
        }
    }

    pub fn count_nodes(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
        let left_depth = Self::get_left_depth(&root);
        let right_depth = Self::get_right_depth(&root);
        if left_depth == right_depth {
            return 2_i32.pow(left_depth) - 1;
        }

        let mut left = 0;
        let mut right = 2_u32.pow(left_depth - 1) - 1;
        while left <= right {
            let mid = (left + right) / 2;
            match Self::is_nth_leaf_live(mid, left_depth - 1, &root) {
                true => left = mid + 1,
                false => right = mid - 1,
            }
        }

        let exclude_last_level = 2_i32.pow(left_depth - 1) - 1;
        let last_level = left as i32;
        exclude_last_level + last_level
    }
}

#[test]
fn test_empty_tree() {
    let tree = None;

    assert_eq!(Solution::count_nodes(tree), 0);
}

#[test]
fn test_single_node_tree() {
    let tree = Some(Rc::new(RefCell::new(TreeNode::new(1))));

    assert_eq!(Solution::count_nodes(tree), 1);
}

#[test]
fn test_4_level_complete_tree() {
    let tree = Some(Rc::new(RefCell::new(TreeNode {
        val: 1,
        left: Some(Rc::new(RefCell::new(TreeNode {
            val: 2,
            left: Some(Rc::new(RefCell::new(TreeNode {
                val: 4,
                left: Some(Rc::new(RefCell::new(TreeNode {
                    val: 8,
                    left: None,
                    right: None,
                }))),
                right: Some(Rc::new(RefCell::new(TreeNode {
                    val: 9,
                    left: None,
                    right: None,
                }))),
            }))),
            right: Some(Rc::new(RefCell::new(TreeNode {
                val: 5,
                left: None,
                right: None,
            }))),
        }))),
        right: Some(Rc::new(RefCell::new(TreeNode {
            val: 3,
            left: Some(Rc::new(RefCell::new(TreeNode {
                val: 6,
                left: None,
                right: None,
            }))),
            right: Some(Rc::new(RefCell::new(TreeNode {
                val: 7,
                left: None,
                right: None,
            }))),
        }))),
    })));

    assert_eq!(Solution::count_nodes(tree), 9);
}

#[test]
fn test_4_level_full_and_complete_tree() {
    let tree = Some(Rc::new(RefCell::new(TreeNode {
        val: 1,
        left: Some(Rc::new(RefCell::new(TreeNode {
            val: 2,
            left: Some(Rc::new(RefCell::new(TreeNode {
                val: 4,
                left: Some(Rc::new(RefCell::new(TreeNode {
                    val: 8,
                    left: None,
                    right: None,
                }))),
                right: Some(Rc::new(RefCell::new(TreeNode {
                    val: 9,
                    left: None,
                    right: None,
                }))),
            }))),
            right: Some(Rc::new(RefCell::new(TreeNode {
                val: 5,
                left: Some(Rc::new(RefCell::new(TreeNode {
                    val: 10,
                    left: None,
                    right: None,
                }))),
                right: Some(Rc::new(RefCell::new(TreeNode {
                    val: 11,
                    left: None,
                    right: None,
                }))),
            }))),
        }))),
        right: Some(Rc::new(RefCell::new(TreeNode {
            val: 3,
            left: Some(Rc::new(RefCell::new(TreeNode {
                val: 6,
                left: Some(Rc::new(RefCell::new(TreeNode {
                    val: 12,
                    left: None,
                    right: None,
                }))),
                right: Some(Rc::new(RefCell::new(TreeNode {
                    val: 13,
                    left: None,
                    right: None,
                }))),
            }))),
            right: Some(Rc::new(RefCell::new(TreeNode {
                val: 7,
                left: Some(Rc::new(RefCell::new(TreeNode {
                    val: 14,
                    left: None,
                    right: None,
                }))),
                right: Some(Rc::new(RefCell::new(TreeNode {
                    val: 15,
                    left: None,
                    right: None,
                }))),
            }))),
        }))),
    })));

    assert_eq!(Solution::count_nodes(tree), 15);
}
```
