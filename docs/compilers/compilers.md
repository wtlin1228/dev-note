# Compilers

## Introduction

There are two approaches to implementing programming languages, compilers, and interpreters.

```

           off-line                   Data
                                       │
               ┌────────────┐          │
               │            │          ▼
Program ──────►│  Compiler  ├─────► Executable
               │            │          │
               └────────────┘          │
                                       ▼
                                      Output

```

```

            on-line

               ┌─────────────┐
Program ──────►│             │
               │ Interpreter ├────► Output
   Data ──────►│             │
               └─────────────┘

```

The structure of a compiler:

- Lexical Analysis
- Parsing
- Semantic Analysis
- Optimization
- Code Generation

## Lexical Analysis

### Token Class (or Class)

- In English: noun, verb, adjective, ...
- In a programming language: Identifiers, Keywords, '(', ')', Numbers, ...

Token classes correspond to sets of strings

- Identifier: strings of letters or digits, starting with a letter (A1, Foo, B17)
- Integer: a non-empty string of digits (0, 12, 001, 00)
- Keyword: 'else' or 'if' or 'begin' or...
- Whitespace: a non-empty sequence of blanks, newlines, and tabs

### The Goal of a Lexical Analysis

Lexical Analyzer communicate tokens to the parser

```

                     ┌────────────────────┐      token       ┌──────────┐
  string             │                    │  <Class,string>  │          │
           ─────────►│  Lexical Analyzer  ├─────────────────►│  Parser  │
 foo = 42            │                    │                  │          │
                     └────────────────────┘                  └──────────┘

                                       <Id, "foo">  <Op, "=">  <Int, 42>

```

An implementation must do two things:

- Recognize substrings corresponding to tokens (The lexemes)
- Identify the token class of each lexeme

The goal is to partition the string. This is implemented by reading left-to-right, recognizing on token at a time. Lookahead may be required to decide where one token ends and the next token begins. But having lot of lookahead complicates the implementation of lexical analysis so one of the goals in the design of lexical systems is to minimize the amount of lookahead.

### Regular Languages

Regular languages is the usual tool to specify which set of string belongs to each token class.

- Single character

  'c' = {"c"}

- Epsilon

  ε = {""}

- Union

  A + B = {a | a ∈ A} ∪ {b | b ∈ B}

- Concatenation

  AB = {ab | a ∈ A, b ∈ B}

- Iteration

  A\* = Union(Ai) for i >= 0

Regular expressions(syntax) specify regular languages(set of strings).

### Formal Languages

#### Alphabet

**Def.** Let Σ be a set of characters (an alphabet). A language over Σ is a set of strings of characters drawn from Σ

Example:

1. English

   - Alphabet = English characters
   - Language = English sentences

2. C

   - Alphabet = ASCII
   - Language = C programs

#### Meaning Function

Meaning function `L` maps syntax to semantics

$$ L(e) = M $$

Use meaning function in the regular expression -> regular languages:

- L(ε) = {""}
- L('c') = {"c"}
- L(A + B) = L(A) ∪ L(B)
- L(AB) = {ab | a ∈ L(A), b ∈ L(B)}
- L(A\*) = Union(L(Ai)) for i >= 0

Why use a meaning function?

- Makes clear what is syntax, what is semantics
- Allows us to consider notation as a separate issue
- Because expressions and meanings are not 1-1
- Meaning is many to one (Never one to many)

### Lexical Specifications

#### Integer

Integer: a non-empty string of digits

```
digit = '0' + '1' + '2' + '3' + '4' + '5' + '6' + '7' + '8' + '9'
Integer = digit digit*
        = digit+
```

#### Identifier

Identifier: strings of letters or digits, starting with a letter

```
letter = 'a' + 'b' + 'c' + ... + 'z' + 'A' + 'B' + 'C' + ... + 'Z'
       = [a-zA-Z]
Identifier = letter(letter + digit)*
```

#### Whitespace

Whitespace: a non-empty sequence of blanks, newlines, and tabs

```
Whitespace = (' ' + '\n' + '\t' + ...)+
```

#### How to do?

1. Write a rexp for the lexemes of each token class

   - Number = digit+
   - Keyword = 'if' + 'else' + ...
   - Identifier = letter(letter + digit)\*
   - OpenPar = '('
   - ...

2. Construct R, matching all lexemes for all tokens

   ```
   R = Keyword + Identifier + Number + ...
     = R1 + R2 + ...
   ```

3. Let input be x1...xn

   For 1 <= 1 <= n check x1...xi ∈ L(R) ?

4. If success, then we know that

   x1...xi ∈ L(Rj) for some j

5. Remove x1...xi from input and go to (3)

#### Question1: But how much input is used? (To resolve ambiguities)

x1...xi ∈ L(R)
x1...xj ∈ L(R)
i != j

We should always tack the longer one, and that's called the Maximal Munch. The reason for this is that's just the way how humans themselves read things.

#### Question2: Which token is used? (To resolve ambiguities)

x1...xi ∈ L(R), R = R1 + ... + Rn

x1...xi ∈ L(Rj)
x1...xi ∈ L(Rk)

For example, "if" ∈ L(Keywords) and "if" ∈ L(Identifier)

The way this gets resolved is by a priority ordering and typically the rule is to choose the one listed first.

#### Question3: What if no rule matches? (To handle errors)

x1...xi ∉ L(R)

It's very important for compilers to do good error handling. They can't simply crash. The solution is to write a category of error strings and put it last in priority.

## Finite Automata

- Regular expressions = specification
- Finite automata = implementation

A finite automata consists of

- An input alphabet `Σ`
- A finite set of states `S`
- A start state `n`
- A set of accepting states `F ⊆ S`
- A set of transitions `state ->input state`

Language of a finite automata = set of accepted strings

Example: A finite automation that accepts only "1"

![simple-finite-automata](./simple-finite-automata.png)

Example: A finite automaton that accepts any number of 1's followed by a single 0

![simple-finite-automata-2](simple-finite-automata-2.png)

ε-moves is another kind of transition, it's a kind of free move from the machine. It can move to a different state without consuming any input.

### Two kinds of Finite Automata

- Deterministic Finite Automata (DFA)
  - One transition per input per state
  - No ε-moves
  - DFAs are faster to execute since there are no choices to consider
- Nondeterministic Finite Automata (NFA)
  - Can have multiple transitions for one input in a given state
  - Can have ε-moves
  - NFAs are, in general, smaller (exponentially smaller)

### Regular Expression to NFAs

Lexical Specification -> Regular expressions -> NFA -> DFA -> Table driven implementation of DFA

![regex-to-NFA](regex-to-NFA.png)

Example: `(1+0)*1`

![rexp-to-NFA-example](rexp-to-NFA-example.png)

### NFA to DFA

`ε-closure(State A) = S` means State A could reach S (a set of states) by only epsilon moves.

|        | NFA          | DFA                          |
| ------ | ------------ | ---------------------------- |
| states | S (count: n) | subset of S (count: 2^n - 1) |
| start  | s ∈ S        | ε-closure(s)                 |
| final  | F ∈ S        | { X \| X ∩ F != ɸ}           |

states = subset of {ABCDEFGHIJ}, DFA has `2^10` states
start = {ABCDHI}
final = {EGABCDHIJ}

![NFA-with-state-label](NFA-with-state-label.png)
![DFA](DFA.png)

## Implementing Finite Automata

DFA table can get quite large since a DFA has 2^n states for a NFA with n states. Therefore, sometimes we would implement NFA directly instead of DFA.

DFA and NDA trade between speed and space.

- DFAs are faster but less compact
- NFAs are concise but slower

### DFA

A DFA can be implemented by a 2D table T

| state \ symbol | a       | b       |
| -------------- | ------- | ------- |
| i              | T[i, a] | T[i, b] |
| j              | T[j, a] | T[j, b] |
| k              | T[k, a] | T[k, b] |

![DFA-table](DFA-table.png)

| state \ symbol | 0   | 1   |
| -------------- | --- | --- |
| S              | T   | U   |
| T              | T   | U   |
| U              | T   | U   |

```
i = 0
state = 0
while (input[i]) {
  state = TABLE[state, input[i]]
  i++
}
```

We can improve the table even further by making the DFA table into 1-dimensional table.

| state | pointer |
| ----- | ------- |
| S     | r1      |
| T     | r1      |
| U     | r1      |

`r1` is also a 1-dimensional table as following:

| 0   | 1   |
| --- | --- |
| T   | U   |

### NFA

![NFA-with-state-label](NFA-with-state-label.png)

| state \ symbol |  0  |  1  |   ε   |
| -------------- | :-: | :-: | :---: |
| A              |     |     | {B,H} |
| B              |     |     | {C,D} |
| C              |     | {E} |       |
| D              | {F} |     |       |
| E              |     |     |  {G}  |
| F              |     |     |  {G}  |
| G              |     |     | {A,H} |
| H              |     |     |  {I}  |
| I              |     | {J} |       |
| J              |     |     |       |

## Parsing

A parser takes the sequence of tokens from lexer as input and output the parse tree of the program.

### Context Free Grammars

Not all strings of tokens are programs, parser must distinguish between valid and invalid strings of tokens. So we need:

- a language for describing valid strings of tokens
- a method for distinguishing valid from invalid strings of tokens

Programming languages have a natural recursive structure. For example in Cool, An `EXPR` is

- if `EXPR` then `EXPR` else `EXPR` fi
- while `EXPR` loop `EXPR` pool
- ...

Context-free grammars are a natural notation for this recursive structure.

A CFG consists of

- A set of terminals `T`
- A set of non-terminals `N`
- A start symbol `S`
- A set of productions `X -> Y1...Yn`, where X ∈ N and Yi ∈ N ∪ T ∪ {ε}

#### The Process

1. Begin with a string with only the start symbol `S`
2. Replace any non-terminal `X` in the string by the right-hand side of some production X -> Y1...Yn
3. Repeat (2) until there are no non-terminals

#### Definition

Let `G` be a context-free grammar with start symbol `S`. Then the language `L(G)` of `G` is:

`{ a1...an | ∀i ai ∈ T and a1...an is reachable starting from S }`

### Derivation

- A derivation is a sequence of productions
- A derivation can be drawn as a tree
  - Start symbol is the tree's root
  - For a production `X -> Y1...Yn`, add children Y1...Yn to node X

Let's consider this example:

- Grammar

  ```
  E -> E + E
     | E * E
     | (E)
     | id
  ```

- String `id * id + id`

The left-most derivation is:

```
   E
-> E + E
-> E * E + E
-> id * E + E
-> id * id + E
-> id * id + id
```

And the parse tree build upon the left-most derivation is:

```
          E
       /  |  \
      E   +   E
   /  |  \    |
  E   *   E   id
  |       |
  id      id
```

- A parse tree has
  - Terminals at the leaves
  - Non-terminals at the interior nodes
- An in-order traversal of the leaves is the original input
- The parse tree shows the association of operations, the input string does node
- There is an equivalent notion of right-most derivation

  ```
    E
  -> E + E
  -> E + id
  -> E * E + id
  -> E * id + id
  -> id * id + id
  ```

Note that right-most and left-most derivations have the same parse tree.

- We are not just interested in whether s ∈ L(G)
  - We need a parse tree for s
- A derivation defines a parse tree
  - But one parse tree may have many derivations
- Left-most and right-most derivations are important in parser implementation

### Ambiguity

This string `id * id + id` has two parse trees

```
          E                      E
       /  |  \                /  |  \
      E   +   E              E   *   E
   /  |  \    |              |    /  |  \
  E   *   E   id             id  E   +   E
  |       |                      |       |
  id      id                     id      id
```

- A grammar is ambiguous if it has more than one parse tree for some string
  - Equivalently, there is more than one right-most or left-most derivation for some string
- Ambiguity is BAD
  - Leaves meaning of some programs ill-defined
- There are several ways to handle ambiguity
- Most direct method is to rewrite grammar unambiguously

  ```
  E -> E' + E | E'
  E' -> id * E' | id | (E) * E' | (E)
  ```

  so our `id * id + id` becomes:

  ```
          E
       /  |  \
      E'  +   E
   /  |  \    |
  id  *   E'  E'
          |   |
          id  id
  ```

- Enforces precedence of `*` over `+`

  E handles `+`: `E -> E' + E -> E' + E' + E -> ... -> E' + ... + E'`
  E' handles `*`:

  - `id * E' -> id * id * E' -> ... -> id * ... * id`
  - `(E) * E' -> (E) * (E) * E' -> ... -> (E) * ... * (E)`

The expression `if E1 then if E2 then E3 else E4` has two parse trees

```
      if             if
    / | \           /  \
   E1 if E4        E1   if
     /  \              / | \
    E2  E3           E2  E3 E4
```

We want to make the `else` matches the closest unmatched `then`

```
E -> MIF   /* all then are matched */
   | UIF   /* some then is unmatched */

MIF -> if E then MIF else MIF
     | OTHER

UIF -> if E then E
     | if E then MIF else UIF
```

## Top-Down Parsing

### Abstract Syntax Trees

A parser traces the derivation of a sequence of tokens, but the rest of the compiler needs a structural representation of the program. Parse Trees is such a data structure, but Abstract Syntax Trees is what we want to work on since it ignore some details.

### Recursive Descent Algorithm

Define boolean functions that check for a match of

- A given token terminal

  `bool term(TOKEN tok) { return *next++ = tok; }`

- The nth production of S

  `bool Sn() {...}`

- Try all productions of S

  `bool S() {...}`

Example:

```
E -> T | T + E
T -> int | int * T | (E)
```

- For production E -> T

  `bool E1() { return T(); }`

- For production E -> T + E

  `bool E2() { return T() && term(PLUS) && E(); }`

- For all productions of E (with backtracking)

  ```
  bool E() {
    TOKEN *save = next;
    return (next = save, E1())
        || (next = save, E2()); }
  ```

- Functions for non-terminal T

  ```
  bool T1() { return term(INT); }
  bool T2() { return term(INT) && term(TIMES) && T(); }
  bool T3() { return term(OPEN) && E() && term(CLOSE); }

  bool T() {
    TOKEN *save = next;
    return (next = save, T1())
        || (next = save, T2())
        || (next = save, T3()); }
  ```

#### Recursive Descent Algorithm Limitation

Use Recursive Descent Algorithm to parse `(int)` is good.

```
E -> T | T + E
T -> int | int * T | (E)
```

But Recursive Descent Algorithm can't parse `int * int`, it will be rejected since we do not apply backtracking once we have found a production that succeeds for non-terminals.

### Left Recursion (Left Factoring)

- In general, S -> Sα1 | ... | Sαn | β1 | ... | βm
- All strings derived from S starts with one of `β1,...,βm` and continue with serval instances of `α1,...,αn`
- Rewrite as
  - S -> β1S' | ... | βmS'
  - S' -> α1S' | ... | αnS' | ε

### Predictive Parsing Algorithm

Like recursive-descent but parser can predict which production to use by looking at the next few tokens and without backtracking. Predictive parsers accepts LL(k) grammars.

- First L: left-to-right
- Second L: left-most derivation
- k: k tokens lookahead

For this grammar, it's hard to predict

```
E -> T | T + E
T -> int | int * T | (E)
```

because:

- For `T` two productions start with `int`
- For `E` it is not clear how to predict

#### Fix the un-predictable grammar with left-factoring

```
E -> TX
X -> + E | ε
T -> intY | (E)
Y -> * T | ε
```

#### The LL(1) Parsing Table

| non-terminal \ terminal |  int  | \*  |  +  |  (  |  )  |  $  |
| ----------------------- | :---: | :-: | :-: | :-: | :-: | :-: |
| E                       |  TX   |     |     | TX  |     |     |
| X                       |       |     | + E |     |  ε  |  ε  |
| T                       | int Y |     |     | (E) |     |     |
| Y                       |       | \*T |  ε  |     |  ε  |  ε  |

```
initialize stack = <S$> and next
repeat
  case stack of
    <X, rest>  : if T[X, *next] = Y1...Yn
                    then stack  <- <Y1...Yn rest>;
                    else error();
    <t, rest>  : if t == *next ++
                    then stack <- <rest>;
                    else error();
until stack == < >
```

#### Parse the `int * int$`

| Stack  | Input       | Action   |
| ------ | ----------- | -------- |
| E$     | int \* int$ | TX       |
| TX$    | int \* int$ | intY     |
| intYX$ | int \* int$ | terminal |
| YX$    | \* int$     | \*T      |
| \*TX$  | \* int$     | terminal |
| TX$    | int$        | intY     |
| intYX$ | int$        | terminal |
| YX$    | $           | ε        |
| X$     | $           | ε        |
| $      | $           | ACCEPT   |

```
              E
             / \
            /   \
           T     X
          / \    |
         /   \   ε
       int    Y
             / \
            /   \
           *     T
                / \
               /   \
             int    Y
                    |
                    ε
```

#### First Sets

Definition: `First(X) = {t | X ->* tα} ∪ {ε | X ->* ε}`

Algorithm sketch:

1. First(t) = {t}, where t is a terminal
2. ε ∈ First(X)
   - if X -> ε
   - if X -> A1...An and ε ∈ First(Ai) for 1 <= A <= n
3. First(α) ⊆ First(X) if X -> A1...Anα
   - and ε ∈ First(Ai) for 1 <= A <= n

The first sets of this grammar:

```
E -> TX
X -> + E | ε
T -> intY | (E)
Y -> * T | ε
```

| X     | First(X)   |
| ----- | ---------- |
| `+`   | `{+}`      |
| `*`   | `{*}`      |
| `(`   | `{(}`      |
| `)`   | `{)}`      |
| `int` | `{int}`    |
| `E`   | First(T)   |
| `T`   | `{(, int}` |
| `X`   | `{+, ε}`   |
| `Y`   | `{*, ε}`   |

#### Follow Sets

Definition: `Follow(X) = {t | S ->* βXtδ}`

Algorithm sketch:

1. $ ∈ Follow(S)
2. First(β) - {ε} ⊆ Follow(X)
   - For each production A -> αXβ
3. Follow(A) ⊆ Follow(X)
   - For each production A -> αXβ where ε ∈ First(β)

The follow sets of this grammar:

```
E -> TX
X -> + E | ε
T -> intY | (E)
Y -> * T | ε
```

| X     | Follow(X)      |
| ----- | -------------- |
| `+`   | `{(, int}`     |
| `*`   | `{(, int}`     |
| `(`   | `{(, int}`     |
| `)`   | `{$, +, )}`    |
| `int` | `{*, $, +, )}` |
| `E`   | `{$, )}`       |
| `T`   | `{$, +, )}`    |
| `X`   | `{$, )}`       |
| `Y`   | `{$, +, )}`    |

#### Construct LL(1) Parsing Table

For each production A -> α in the Grammar G do:

- For each terminal t ∈ First(α) do
  - T[A, t] = α
- If ε ∈ First(α), for each t ∈ Follow(A) do
  - T[A, t] = α
- If ε ∈ First(α) and $ ∈ Follow(A) do
  - T[A, $] = α

#### Most Programming Language CFGs Are Not LL(1)

If any entry is multiply defined then G is not LL(1)

For example: S -> Sa | b

First(S) = {b}
Follow(S) = {$, a}

|     | a   | b               | $   |
| --- | --- | --------------- | --- |
| S   |     | `b` and `Sa` ❌ |     |

A grammar isn't LL(1) if it is

- not left factored
- not left recursive
- ambiguous
- other grammar are not LL(1), ex: need more than 1 lookahead

# Resource

- http://openclassroom.stanford.edu/MainFolder/DocumentPage.php?course=Compilers&doc=docs/pa.html
- https://web.stanford.edu/class/cs143/
- [StanfordOnline SOE.YCSCS1 on EDX](https://learning.edx.org/course/course-v1:StanfordOnline+SOE.YCSCS1+3T2020/home)
- [Engineering a Compiler 3rd Edition](https://www.amazon.com/-/zh_TW/Keith-D-Cooper/dp/0128154128/ref=sr_1_11)
