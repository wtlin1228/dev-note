```css
.whatever {
  width: 100px;
  height: 100px;
}
```

We only need to modify one place in the DevTool with css custom properties.

```css
.whatever {
  --size: 100px;
  width: var(--size);
  height: var(--size);
}
```
