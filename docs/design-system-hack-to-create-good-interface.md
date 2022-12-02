What makes a user interface good?

- It should be intuitive.
- It should be accessible.
- It should be consistent.

  So if you know how to use one part of the application, you can guess how to use another part. That's called consistent.

What makes a component API interface good?

- It should be intuitive to read or author code.
- It should be accessible by default.
- It should be consistent.

  It should have a small API surface area. If you know how to use one component, you can guess how to use another component because the API interface is consistent.

# AnchoredOverlay

```jsx
import { AnchoredOverlay, Button } from "@primer/react"

const [open, setOpen] = useState(false)

return (
  <AnchoredOverlay
    open={open}
    onOpen={() => setOpen(true)}
    onClose={() => setOpen(false)}
    renderAnchor={(anchorProps) => (
      <Button {...anchorProps}>Click me to open</Button>
    )}
  >
    <p>This overlay is "anchored" to the above button</p>
    <Button>Button 1</Button>
    <Button>Button 2</Button>
    <Button>Button 3</Button>
  </AnchoredOverlay>
)
```

Some improvements can be applied:

- can handle open/close internally
- remove render props API

```jsx
import { ActionMenu } from "@primer/react"

return (
  <ActionMenu>
    <ActionMenu.Button>Assignees</ActionMenu.Button>
    <ActionMenu.Overlay width="medium">{contents}</ActionMenu.Overlay>
  </ActionMenu>
)
```

And the implementation will be like this:

```jsx
import { Buttons } from "@primer/react"
import { TriangleDownIcon } from "@primer/react-octicons"

const ActionMenu = ({ children }) => {
  return children
}

const MenuButton = (props) => {
  return <Button trailingIcon={TriangleDownIcon} {...props} />
}
ActionMenu.Button = MenuButton

const MenuOverlay = (props) => {
  const [open, setOpen] = useState(false)

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      // renderAnchor={(anchorProps) => ???} 🤔
      {...props}
    >
      {props.children}
    </AnchoredOverlay>
  )
}
ActionMenu.Overlay = MenuOverlay
```

But, how to pass the `MenuButton` to the `MenuOverlay` because we need it for `renderAnchor`?

One way is to pull it up a little bit.

```jsx
import { Buttons } from "@primer/react"
import { TriangleDownIcon } from "@primer/react-octicons"

const MenuContext = React.createContext({})
const ActionMenu = ({ children }) => {
  const [Anchor, setAnchor] = React.useState(null)

  return (
    <MenuContext.Provider value={{ Anchor, setAnchor }}>
      {children}
    </MenuContext.Provider>
  )
}

const MenuButton = (props) => {
  const { Anchor, setAnchor } = React.useContext(MenuContext)

  if (!Anchor) {
    setAnchor((anchorProps) => (
      <Button trailingIcon={TriangleDownIcon} {...props} />
    ))
  }

  return null
}
ActionMenu.Button = MenuButton

const MenuOverlay = (props) => {
  const [open, setOpen] = React.useState(false)
  const { Anchor } = React.useContext(MenuContext)

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderAnchor={(anchorProps) => <Anchor {...anchorProps} />}
      {...props}
    >
      {props.children}
    </AnchoredOverlay>
  )
}
ActionMenu.Overlay = MenuOverlay
```

The approach above is all cool in the CSR. But in SSR it's not good.
Because the button anchor will not show up until React do the hydration on the client and `setAnchor` is called.

So, how to make the button anchor be rendered in the server?

```jsx
import { Buttons } from "@primer/react"
import { TriangleDownIcon } from "@primer/react-octicons"

// 🚨 Hack for good API!
// we kidnap Button from children and pass it to AnchoredOverlay
// to render with additional props for accessibility
const ActionMenu = ({ children }) => {
  let anchor = null

  const contents = React.Children.map(children, (child) => {
    if (child.type === MenuButton) {
      anchor = child
      return null
    } else if (child.type === MenuOverlay) {
      return React.cloneElement(child, {
        renderANchor: (anchorProps) => {
          return React.cloneElement(anchor, anchorProps)
        },
      })
    }
    throw new Error(`
      ActionMenu does not identify ${child.type}. 
      Please use <ActionMenu.Button> and <ActionMenu.Overlay> 
      Refer to https://primer.style/react/ActionMenu
    `)
  })

  return contents
}

const MenuButton = (props) => {
  return <Button trailingIcon={TriangleDownIcon} {...props} />
}
ActionMenu.Button = MenuButton

const MenuOverlay = (props) => {
  const [open, setOpen] = useState(false)

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      // renderAnchor={(anchorProps) => ???} 🤔
      {...props}
    >
      {props.children}
    </AnchoredOverlay>
  )
}
ActionMenu.Overlay = MenuOverlay
```

Ya, this is totally a hack. But,

> Hacks that make the code easier to read and author,
> helping developers do a good job fast,
> within reasonable constraints of the system are okay

# NavList

```jsx
import { NavList } from "@primer/react"
import {...} from '@primer/react-octicons'

return (
  <NavList>
    <NavList.Item
      href="/settings/profile"
      icon={PersonIcon}
      aria-current={window.location.pathname === 'settings/profile' ? 'page' : undefined}
    >
      Public profile
    </NavList.Item>
  </NavList>
)
```

and we have lots of items in the list

```jsx
import { NavList } from "@primer/react"
import {...} from '@primer/react-octicons'

return (
  <NavList>
    <NavList.Item
      href="/settings/profile"
      icon={PersonIcon}
      aria-current={window.location.pathname === 'settings/profile' ? 'page' : undefined}
    >
      Public profile
    </NavList.Item>
    <NavList.Item
      href="/settings/account"
      icon={PersonIcon}
      aria-current={window.location.pathname === 'settings/account' ? 'page' : undefined}
    >
      Account
    </NavList.Item>
    <NavList.Item
      href="/settings/appearance"
      icon={PersonIcon}
      aria-current={window.location.pathname === 'settings/appearance' ? 'page' : undefined}
    >
      Appearance
    </NavList.Item>
    <NavList.Item
      href="/settings/accessibility"
      icon={PersonIcon}
      aria-current={window.location.pathname === 'settings/accessibility' ? 'page' : undefined}
    >
      Accessibility
    </NavList.Item>
    <NavList.Item
      href="/settings/notifications"
      icon={PersonIcon}
      aria-current={window.location.pathname === 'settings/notifications' ? 'page' : undefined}
    >
      Notifications
    </NavList.Item>
  </NavList>
)
```

and then we will wanna group some of the items together of course

```jsx
import { NavList } from "@primer/react"
import {...} from '@primer/react-octicons'

return (
  <NavList>
    <NavList.Item ...>Public profile </NavList.Item>
    <NavList.Item ...>Account        </NavList.Item>
    <NavList.Item ...>Appearance     </NavList.Item>
    <NavList.Item ...>Accessibility  </NavList.Item>
    <NavList.Item ...>Notifications  </NavList.Item>

    <NavList.Group title="Access" icon={LockIcon}>
      <NavList.Item ...>Billing and plans           </NavList.Item>
      <NavList.Item ...>Emails                      </NavList.Item>
      <NavList.Item ...>Password and authentication </NavList.Item>
      <NavList.Item ...>SSH and GPG keys            </NavList.Item>
      <NavList.Item ...>Organizations               </NavList.Item>
      <NavList.Item ...>Moderation                  </NavList.Item>
    </NavList.Group>

    <NavList.Group title="Code and automation" icon={BotIcon}>
      ...
    </NavList.Group>

    <NavList.Group title="Integration" icon={BotIcon}>
      ...
    </NavList.Group>

    <NavList.Group title="Developers" icon={BotIcon}>
      ...
    </NavList.Group>
  </NavList>
)
```

Now, look at the implementation.

Note: `NavList.Group` need to be opened if the current page is one of its items.

```jsx
const NavList = (props) => (
  <nav>
    <li>...</li>
  </nav>
)

const NavItem = (props) => <li>...</li>
NavList.Item = NavItem

const NavGroup = ({ title, icon, children }) => {
  let defaultOpen = false // how do we set this value automatically?

  const [open, setOpen] = React.useState(defaultOpen)

  return (
    <li>
      <Button
        leadingIcon={icon}
        onClick={() => setOpen(!open)}
        trailingIcon={open ? CaretUpIcon : CaretDownIcon}
      >
        {title}
      </Button>
      <ul className={open ? "open" : "close"}>{children}</ul>
    </li>
  )
}
NavList.Group = NavGroup
```

But, how do we set this value automatically?

```jsx
const NavGroup = ({ title, icon, children }) => {
  let defaultOpen = false

  React.Children.map(child => {
    if (child.props['aria-current']) defaultOpen = true
  })

  const [open, setOpen] = React.useState(defaultOpen)

  return (...)
}
```

Ok, but users might use different routers like `react-router`, `next-router` or `remix-router`.

```jsx
import { NavList } from "@primer/react"
import {...} from '@primer/react-octicons'

return (
  <NavList>
    <NavList.Group title="Access" icon={LockIcon}>
      <RouterLink
        icon={CreditCardIcon}
        href="/settings/billing"
      >
        Billing and plans
      </RouterLink>
    </NavList.Group>
  </NavList>
)

const RouterLink = ({ icon, href }) => {
  const router = useRouter()
  return (
    <NextLink href={href} passHref aria-current={href === router.asPath ? 'page' : undefined}>
      <NavList.Item icon={icon}>{props.children}</NavList.Item>
    </NextLink>
  )
}
```

So, sometimes the `aria-current` label we need could be nested inside the children.
How do solve this?

```jsx
const NavGroup = ({ title, icon, children }) => {
  const [open, setOpen] = React.useState(false)

  const containerRef = React.useRef()

  React.useLayoutEffect(() => {
    if (containerRef.current.querySelector("[aria-current]")) {
      setOpen(true)
    }
  }, [containerRef])

  return <li ref={containerRef}>...</li>
}
```

Is it an anti-pattern?

The goal of a good component is to abstract annoying work away,
especially work that is not core to the user's goals.

The last thing here is that whether a group should be open is determined on the client in the half mount.
So if we are in the slow 3G environment, there would be a delay before the `NavList.Group` is opened.

But, it okay because we just want it to be sooner.

# Reference

- Code Crimes For Good Component API - https://portal.gitnation.org/contents/back-to-the-future-899
