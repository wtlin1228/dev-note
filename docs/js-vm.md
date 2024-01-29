The way we create objects matters! The good rule of thumb is initialize all your properties in the beginning, so the objects are monomorphic. Monomorphic ensures the hidden classes are the same, and that can be cached by inline caches, giving us better performance.

# Reference

- [Explaining JavaScript VMs in JavaScript - Inline Caches](https://mrale.ph/blog/2012/06/03/explaining-js-vms-in-js-inline-caches.html)
- [Miško Hevery - JavaScript under the hood](https://github.com/mhevery/JavaScriptVM_under_the_hood)
