A react element describes the desired UI state.

Elements are public, fibers are internal.

Elements are ephemeral, fibers are long-lived.

Elements are immutable, fibers are mutable.

The fiber loop:

```
workLoopSync -> beginWork -> completeWork -> commitRoot
                [         Render        ]    [ commit ]
```
