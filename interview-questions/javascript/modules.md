# Classic Module

Singleton:

```js
const Student = (function defineStudent() {
  var records = [
    { id: 14, name: "Kyle", grade: 86 },
    { id: 73, name: "Suzy", grade: 87 },
    { id: 112, name: "Frank", grade: 75 },
    { id: 6, name: "Sarah", grade: 91 },
  ]

  var publicAPI = {
    getName,
  }

  return publicAPI

  // ************************

  function getName(studentID) {
    var student = records.find((student) => student.id == studentID)
    return student.name
  }
})()

Student.getName(73) // Suzy
```

Module Factory:

```js
function defineStudent() {
  var records = [
    { id: 14, name: "Kyle", grade: 86 },
    { id: 73, name: "Suzy", grade: 87 },
    { id: 112, name: "Frank", grade: 75 },
    { id: 6, name: "Sarah", grade: 91 },
  ]

  var publicAPI = {
    getName,
  }

  return publicAPI

  // ************************

  function getName(studentID) {
    var student = records.find((student) => student.id == studentID)
    return student.name
  }
}

var fullTime = defineStudent()
fullTime.getName(73) // Suzy
```

# Node CommonJS Modules

- file-based
- module instances are singletons
- everything is private by default

```js
module.exports.getName = getName

var records = [
  { id: 14, name: "Kyle", grade: 86 },
  { id: 73, name: "Suzy", grade: 87 },
  { id: 112, name: "Frank", grade: 75 },
  { id: 6, name: "Sarah", grade: 91 },
]

function getName(studentID) {
  var student = records.find((student) => student.id == studentID)
  return student.name
}
```

# Modern ES Modules (ESM)

- file-based
- module instances are singletons
- everything is private by default
- [different from CJS] always in strict-mode

```js
export { getName }

// ************************

var records = [
  { id: 14, name: "Kyle", grade: 86 },
  { id: 73, name: "Suzy", grade: 87 },
  { id: 112, name: "Frank", grade: 75 },
  { id: 6, name: "Sarah", grade: 91 },
]

function getName(studentID) {
  var student = records.find((student) => student.id == studentID)
  return student.name
}
```

# References

https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/ch8.md
