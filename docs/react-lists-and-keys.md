# How does React key attribute work

A simplified algorithm of the process during re-render looks like this:

- first, React will generate the “before” and “after” “snapshots” of the elements
- second, it will try to identify those elements that already existed on the page, so that it can re-use them instead of creating them from scratch
  - if the “key” attribute exists, it will assume that items with the same “before” and “after” key are the same
  - if the “key” attribute doesn’t exist, it will just use sibling’s indexes as the default “key”
- third, it will:
  - get rid of the items that existed in the “before” phase, but don’t exist in the “after” (i.e. unmount them)
  - create from scratch items that haven’t existed in the “before” variant (i.e. mount them)
  - update items that existed “before” and continue to exist “after” (i.e. re-render them)

# Special case - paginated list

If you go with `key="id"` approach, then every time you change the page you’ll load completely new set of items with completely different ids. Which means React won’t be able to find any “existing” items, unmount the entire list, and mount completely fresh set of items.

But! If you go with `key="index"` approach, React will think that all the items on the new “page” already existed, and will just update those items with the fresh data, leaving the actual components mounted.

This is going to be visibly faster even on relatively small data sets, if item components are complicated.

And exactly the same situation is going to be with all sorts of dynamic list-like data, where you replace your existing items with the new data set while preserving the list-like appearance:

- autocomplete components
- google-like search pages
- paginated tables

Just would need to be mindful about introducing state in those items: they would have to be either stateless, or state should be synced with props.

# Conclusion

A few key takeaways to leave with:

- never use random value in the “key” attribute: it will cause the item to re-mount on every render. Unless of course, this is your intention
- there is no harm in using the array’s index as “key” in “static” lists - those whose items number and order stay the same
- use item unique identifier (“id”) as “key” when the list can be re-sorted or items can be added in random places
- you can use the array’s index as “key” for dynamic lists with stateless items, where items are replaced with the new ones - paginated lists, search and autocomplete results and the like. This will improve the list’s performance.

# Reference

- [React key attribute: best practices for performant lists](https://www.developerway.com/posts/react-key-attribute)
