Sometimes transforming code with AST could be helpful.

```js
import parser from "@babel/parser"
import _traverse from "@babel/traverse"
const traverse = _traverse.default
import { transformFromAstSync } from "@babel/core"

import LOKALISE_KEYS from "./lokalise-keys.js"

const getTable = (keys) => {
  return Object.keys(keys).reduce((acc, curr) => {
    const chineseValue = keys[curr]
    if (!acc[chineseValue]) {
      acc[chineseValue] = []
    }
    acc[chineseValue].push(curr)
    return acc
  }, {})
}

const transformLabels = ({ code, table }) => {
  const log = []
  const ast = parser.parse(code)

  traverse(ast, {
    enter({ node }) {
      if (
        node.type === "ObjectProperty" &&
        node.value.type === "StringLiteral"
      ) {
        if (table[node.value.value] === undefined) {
          log.push(`can not find lokalise key for ${node.value.value}`)
        } else if (table[node.value.value].length > 1) {
          log.push(
            `find more than one lokalise key for ${node.value.value}`,
            table[node.value.value]
          )
        } else {
          node.value.value = table[node.value.value][0]
        }
      }
    },
  })

  const transformResult = transformFromAstSync(ast)
  return { result: transformResult.code, log }
}

const Code = `
const LABELS = translate({
  headers: {
    subOrderDisplayId: '子單編號',
    orderCreatedAt: '訂單建立時間',
    status: '配送狀態',
    supplierName: '供應商',
    totalItemImportPrice: '進價小計',
    deliveryFee: '運費',
    deliveryRule: '運費規則',
    branchName: '訂購店家',
  },
  headerTooltips: {
    estimateArrivalDate: '從訂單建立時間加上收單時間與到貨時間的所需天數。',
    actualDeliveryDate: '訂單被標記已出貨的日期。',
  },
});
`

const main = () => {
  const table = getTable(LOKALISE_KEYS)
  const { result, log } = transformLabels({ code: Code, table })

  console.log("\n", result, "\n")
  console.log("--------- LOG ---------")
  console.log(log)
}

main()
```
