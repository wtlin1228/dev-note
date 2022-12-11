import fs from "fs"
import path from "path"
import { parse } from "@babel/parser"
import traverse from "@babel/traverse"
import { transformFromAstSync } from "@babel/core"

interface IAsset {
  id: number
  filename: string
  dependencies: string[]
  code: string
  mapping: Record<string, number>
}

type IGraph = Map<string, IAsset>

if (process.argv.length === 2) {
  console.error("Expected entry")
  process.exit(1)
}

const ENTRY = process.argv[2]

let ID = 0

const createAsset = (filename: string): IAsset => {
  const content = fs.readFileSync(filename, "utf-8")

  const ast = parse(content, {
    sourceType: "module",
  })

  const dependencies: string[] = []

  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value)
    },
  })

  const transformResult = transformFromAstSync(ast, undefined, {
    presets: ["@babel/env"],
  })

  if (!transformResult || typeof transformResult.code !== "string") {
    throw new Error("Babel transformation error!")
  }

  return {
    id: ID++,
    filename,
    dependencies,
    code: transformResult.code,
    mapping: {},
  }
}

const createGraph = (entry: string): IGraph => {
  const mainAsset = createAsset(entry)

  const graph = new Map()
  graph.set(entry, mainAsset)

  const stack = [mainAsset]
  for (let asset of stack) {
    const dirname = path.dirname(asset.filename)
    asset.dependencies.forEach((relativePath) => {
      const absolutePath = path.join(dirname, relativePath)
      if (!graph.has(absolutePath)) {
        const child = createAsset(absolutePath)
        stack.push(child)
        asset.mapping[relativePath] = child.id
        graph.set(absolutePath, child)
      } else {
        asset.mapping[relativePath] = graph.get(absolutePath).id
      }
    })
  }

  return graph
}

const bundle = (graph: IGraph) => {
  let modules = ""

  graph.forEach((asset) => {
    modules += `
      // ${asset.filename}
      ${asset.id}: [
        function(require, module, exports) {
          ${asset.code}
        },
        ${JSON.stringify(asset.mapping)}
      ],
    `
  })

  const result = `
    (function(modules) {
      function require(id) {
        const [fn, mapping] = modules[id];
        
        function localRequire(relativePath) {
          return require(mapping[relativePath]);
        }

        const module = { exports: {} };

        fn(localRequire, module, module.exports);

        return module.exports;
      }

      require(0);
    })({${modules}})
  `

  return result
}

const graph = createGraph(ENTRY)

const result = bundle(graph)

try {
  fs.mkdirSync("./dist")
} catch {}
fs.writeFileSync("./dist/bundle.js", result)

eval(result)
