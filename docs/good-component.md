# What makes a good component?

- size, that allows reading it without scrolling
- name, that indicates what it does
- no irrelevant state management
- easy-to-read implementation

# When is it time to split a component into smaller ones?

- when a component is too big
- when a component performs heavy state management operations that might affect performance
- when a component manages an irrelevant state

# What are the general components composition rules?

- always start implementation from the very top
- extract components only when you have an actual usecase for it, not in advance
- always start with the Simple components, introduce advanced techniques only when they are actually needed, not in advance
