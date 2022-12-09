const fs = require("fs")
const path = require("path")
const parser = require("@babel/parser")
const traverse = require("@babel/traverse").default
const babel = require("@babel/core")

if (process.argv.length === 2) {
  console.error("Expected entry")
  process.exit(1)
}

const ENTRY = process.argv[2]

let ID = 0

const createAsset = (filename) => {
  const content = fs.readFileSync(filename, "utf-8")

  const ast = parser.parse(content, {
    sourceType: "module",
  })

  const dependencies = []

  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value)
    },
  })

  const { code } = babel.transformFromAst(ast, null, {
    presets: ["@babel/env"],
  })

  return {
    id: ID++,
    filename,
    dependencies,
    code,
    getIdentifier: () => {},
  }
}

console.log(createAsset(ENTRY))

console.log(path.resolve(ENTRY))
console.log(require("chalk"))
