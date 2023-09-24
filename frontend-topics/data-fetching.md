# Data Fetching

## render + fetch chains

Remix team have learned that fetching in components is the quickest way to the slowest UX (not to mention all the content layout shift that usually follows). Components initiate fetches when they mount, but the parent component's own pending state blocks the child from rendering and therefore from fetching!

ref:

- [Remixing React Router](https://remix.run/blog/remixing-react-router) - Ryan Florence, Mar 2022
