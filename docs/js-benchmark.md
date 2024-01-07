# Avoid micro benchmark

Micro benchmark is so easy to make you shoot yourself in the foot and start measuring the wrong things.

## Make sure you are running in the same mode

Make your benchmark runs long enough. Because when the VM starts running, it runs in interpret mode, and later it switches to compile mode.

## Make sure the cost of making the function call isn't dominating the cost of the function

In order to make a function call, the VM needs to store the arguments (in memory or registers), save the current frame pointer and return address. So, be aware of that when the compiler inlines one your functions but not others, the benchmark will be inaccurate, if the cost of the function itself is very cheap.

# Reference

- [Microsoft Dev Blog - Introducing Deopt Explorer](https://devblogs.microsoft.com/typescript/introducing-deopt-explorer/)
- [Miško Hevery - JavaScript under the hood](https://github.com/mhevery/JavaScriptVM_under_the_hood)
- [mraleph](https://mrale.ph/blog/)
