```tsx
export default function App() {
  return (
    <>
      <Counter />
    </>
  )
}

const Counter = component$(() => {
  const count = useSignal(123)
  const onClick = $(() => {
    count.value++
  })
  return (
    <>
      <button onClick$={onClick}>{count.value}</button>
      <Display value={count.value} />
    </>
  )
})

const Display = component$(({ value }: { value: number }) => {
  return (
    <div>
      <span>{value}</span>
    </div>
  )
})
```

```html
<html
  lang="en-us"
  q:container="paused"
  q:version="1.1.4"
  q:render="ssr-dev"
  q:base="/build/"
  q:locale=""
>
  <body lang="en">
    <!--qv q:key=XF_1-->
    <main>
      <!--qv q:s q:sref=5 q:key=--><!--qv q:id=6 q:key=SncU:h3_0--><!--qv q:key=h3_3-->
      <button
        on:click="/src/counter_component_onclick_0vbgbxbt9ko.js#Counter_component_onClick_0VBgbXbt9Ko[0]"
        q:id="7"
      >
        <!--t=8-->123<!---->
      </button>
      <!--qv q:id=9 q:key=jGMF:h3_2-->
      <div q:key="h3_4">
        <span><!--t=a-->123<!----></span>
      </div>
      <!--/qv--><!--/qv--><!--/qv--><!--/qv-->
    </main>
    <!--/qv--><!--/qv-->
    <script type="qwik/json">
      {
        "refs": {
          "7": "0"
        },
        "ctx": {},
        "objs": [
          "\u00121",
          123,
          "\u00110 @0",
          "#8",
          "\u00110 @0",
          {
            "$$value": "4"
          },`
          "\u00115! @0",
          "#a"
        ],
        "subs": [["3 #8 2 #8", "3 #a 6 #a"]]
      }
    </script>
    <script q:func="qwik/json">
      document.currentScript.qFuncs = [(p0) => p0.value]
    </script>
    <script>
      window.qwikevents.push("click")
    </script>
  </body>
  <!--/qv--><!--/qv--><!--/qv-->
</html>
```

Pause on server -> Resume on client

1. make everything lazy loadable

   If I have `onClick` & `onChange` event handlers,
   Qwik will register them in the document & window.

2. store the state in the HTML
3. get the closure

# Note:

Qwik Loader registers `processReadyStateChange`, `change` and `click` event handlers.

```js
addEventListener(doc, "readystatechange", processReadyStateChange)
window.qwikevents.push("change", "click")
```

`processReadyStateChange` will emit the `qinit` and `qidle` event if doc's readyState is interactive or completed.

```js
const processReadyStateChange = () => {
  if (!initialize && ["interactive", "completed"].includes(doc.readyState)) {
    initialize = true
    emitEvent("qinit")
    win.requestIdleCallback(() => emitEvent("qidle"))
  }
}
```

At this point, your website is idle and available to accept user events like click and change. Now we can click the `button`, and Qwik will request the corresponding file by looking for the `QRL`.

1.  get QRLs `/src/counter_component_onclick_0vbgbxbt9ko.js#Counter_component_onClick_0VBgbXbt9Ko[0]`
2.  find container(`q:container`), in this case is `html` element
3.  parse the QRLs, in this case there is only a single QRL

    - lazy-loadable resource: `/src/counter_component_onclick_0vbgbxbt9ko.js`
    - symbol name: `Counter_component_onClick_0VBgbXbt9Ko[0]`

4.  import the resource `/src/counter_component_onclick_0vbgbxbt9ko.js`

    ```js
    import { useLexicalScope } from "/node_modules/@builder.io/qwik/core.mjs?v=9cde1d14"
    export const Counter_component_onClick_0VBgbXbt9Ko = () => {
      const [count] = useLexicalScope()
      count.value++
    }
    ```

5.  resolve container (html)

    - `resolveContainer(containerEl)`
    - from the last script, keep searching `<script type="qwik/json">...<script>`
    - `containerEl._qwikjson_ = JSON.parse(qwikjson)`

      ```js
      html._qwikjson_ = {
        refs: {
          7: "0",
        },
        ctx: {},
        objs: [
          "\u00121",
          123,
          "\u00110 @0",
          "#8",
          "\u00110 @0",
          {
            $$value: "4",
          },
          "\u00115! @0",
          "#a",
        ],
        subs: [["3 #8 2 #8", "3 #a 6 #a"]],
      }
      ```

6.  get the click handler, `const handler = (await module)[symbolName]`
7.  set the qwik context, `doc.__q_context__ = [element, ev, url]`
8.  call the click handler, `handler(event, element)`
9.  get the lexical scope by calling `useLexicalScope`

    ```ts
    export const useLexicalScope = <VARS extends any[]>(): VARS => {
      // $element$: button
      // $event$: PointerEvent {isTrusted: true, pointerId: 1, width: 1, height: 1, pressure: 0, …}
      // $hostElement$: undefined
      // $locale$: undefined
      // $qrl$: undefined
      // $renderCtx$: undefined
      // $seq$: 0
      // $subscriber$: undefined
      // $url$: URL {origin: 'http://localhost:5173', protocol: 'http:', username: '', password: '', host: 'localhost:5173', …}
      // $waitOn$: undefined
      const context: InvokeContext = getInvokeContext()
      let qrl = context.$qrl$
      if (!qrl) {
        const el = context.$element$
        const container = getWrappingContainer(el)
        qrl = parseQRL(decodeURIComponent(String(context.$url$)), container)
        resumeIfNeeded(container)
        const elCtx = getContext(el, _getContainerState(container))
        inflateQrl(qrl, elCtx)
      }
      return qrl.$captureRef$ as VARS
    }
    ```

    - `getInvokeContext()` returns an `InvokeContext`

      ```ts
      export interface InvokeContext {
        $url$: URL | undefined
        $seq$: number
        $hostElement$: QwikElement | undefined
        $element$: Element | undefined
        $event$: any | undefined
        $qrl$: QRL<any> | undefined
        $waitOn$: Promise<any>[] | undefined
        $subscriber$: Subscriber | null | undefined
        $renderCtx$: RenderContext | undefined
        $locale$: string | undefined
      }
      ```

    - resume if `container[q:container]` is paused

      - get the `pauseState` from `container['_qwikjson_]`
      - create container state

        ```ts
        export interface ContainerState {
          readonly $containerEl$: Element

          readonly $proxyMap$: ObjToProxyMap
          $subsManager$: SubscriptionManager

          readonly $watchNext$: Set<SubscriberEffect>
          readonly $watchStaging$: Set<SubscriberEffect>

          readonly $opsNext$: Set<SubscriberSignal>

          readonly $hostsNext$: Set<QContext>
          readonly $hostsStaging$: Set<QContext>
          readonly $base$: string

          $hostsRendering$: Set<QContext> | undefined
          $renderPromise$: Promise<void> | undefined

          $serverData$: Record<string, any>
          $elementIndex$: number

          $pauseCtx$: PauseContext | undefined
          $styleMoved$: boolean
          readonly $styleIds$: Set<string>
          readonly $events$: Set<string>
        }
        ```

        and the subscriptions manager

        ```ts
        export interface SubscriptionManager {
          $groupToManagers$: GroupToManagersMap
          $createManager$(map?: Subscriptions[]): LocalSubscriptionManager
          $clearSub$: (sub: SubscriberEffect | SubscriberHost | Node) => void
          $clearSignal$: (sub: SubscriberSignal) => void
        }
        ```

      - create a tree walker for comments

        - push comment `<!--qv q:id=[qid] q:key=[qkey]-->` to elements
        - push text `<!--t=[qid]-->` to elements

          ```js
          Map {
            0: 'qv q:id=0 q:key=3scc:pY_0',
            1: 'qv q:id=1 q:key=TxCF:35_3',
            2: 'qv q:id=2 q:key=zrbr:35_0',
            // missing 3
            4: 'qv q:id=4 q:key=e0ss:35_1',
            5: 'qv q:id=5 q:key=VkLN:zl_0',
            6: 'qv q:id=6 q:key=SncU:h3_0',
            // missing 7
            8: '123',
            9: 'qv q:id=9 q:key=jGMF:h3_2',
            10: '123',
          }
          ```

      - push element with `<element q:id=[qid] />` to elements

        ```js
        Map {
          0: 'qv q:id=0 q:key=3scc:pY_0',
          1: 'qv q:id=1 q:key=TxCF:35_3',
          2: 'qv q:id=2 q:key=zrbr:35_0',
          // missing 3
          4: 'qv q:id=4 q:key=e0ss:35_1',
          5: 'qv q:id=5 q:key=VkLN:zl_0',
          6: 'qv q:id=6 q:key=SncU:h3_0',
          // missing 7
          8: '123',
          9: 'qv q:id=9 q:key=jGMF:h3_2',
          10: '123',
          3: link // the cononical url
          7: button
        }
        ```

      - create a parser
      - update `containerState.$elementIndex$` to 100,000 from 0
      - init `containerState.$pauseCtx$`
      - emit `qresume` event

    - get element context

      ```ts
      export interface QContext {
        $element$: QwikElement
        $refMap$: any[]
        $flags$: number
        $id$: string
        $props$: Record<string, any> | null
        $componentQrl$: QRLInternal<OnRenderFn<any>> | null
        li: Listener[]
        $seq$: any[] | null
        $watches$: SubscriberEffect[] | null
        $contexts$: Map<string, any> | null
        $appendStyles$: StyleAppend[] | null
        $scopeIds$: string[] | null
        $vdom$: ProcessedJSXNode | null
        $slots$: ProcessedJSXNode[] | null
        $dynamicSlots$: QContext[] | null
        $parent$: QContext | null
        $slotParent$: QContext | null
      }
      ```

      - build `$refMap$` by mapping `refMap` with `getObject`
