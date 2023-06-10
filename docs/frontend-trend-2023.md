# [Svelte](https://svelte.dev/)

https://svelte.dev/blog/svelte-3-rethinking-reactivity

Svelte is reactive.

Svelte doesn't do virtual DOM diffing like React and Vue.
It compiles the components into DOM operations at build time.
The fact that Svelte doesn't have a heavy runtime makes it
a good candidate for websites inside the embedded devices,
especially for low powered ones.

Embedded web: Wearables, Internet of Things, Smart TVs, In-Car Entertainment, ...

Svelte is also a good choice if we need to do intensive data visualization.

# [Qwik](https://qwik.builder.io/)

Qwik is reactive.

I want to know:

- how does `useLexicalScope` work 🤔
