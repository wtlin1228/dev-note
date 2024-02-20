# Linked List

## Problems

- [25. Reverse Nodes in k-Group](https://leetcode.com/problems/reverse-nodes-in-k-group/)

### Reverse Nodes in k-Group

```rust
impl Solution {
    pub fn reverse_k_group(head: Option<Box<ListNode>>, k: i32) -> Option<Box<ListNode>> {
        let mut head = head;
        let mut ans_head = ListNode::new(0);
        let mut ans_prev_group_end = &mut ans_head;

        // perform reversal of k groups with counting
        'finish: loop {
            for _ in 0..k {
                match head.take() {
                    Some(mut current) => {
                        head = current.next.take();
                        current.next = ans_prev_group_end.next.take();
                        ans_prev_group_end.next = Some(current);
                    }
                    None => break 'finish,
                }
            }
            // a group is reversed completely, now advance the ans_prev_group_end
            while ans_prev_group_end.next.is_some() {
                ans_prev_group_end = ans_prev_group_end.next.as_mut().unwrap();
            }
        }

        // reverse the left over again if there is any
        let left_over = ans_prev_group_end.next.take();
        ans_prev_group_end.next = Self::reverse_list(left_over);

        ans_head.next.take()
    }

    fn reverse_list(l: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
        let mut prev: Option<Box<ListNode>> = None;
        let mut curr = l;
        while curr.is_some() {
            let next = curr.as_mut().unwrap().next.take();
            curr.as_mut().unwrap().next = prev;
            prev = curr;
            curr = next;
        }
        prev
    }
}
```
