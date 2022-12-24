const path = require('path');
const { readFileSync, readdirSync, mkdirSync, writeFileSync } = require('fs');

const React = require('react');
const { MemoryRouter } = require('react-router');
const { renderToString } = require('react-dom/server');

require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    target: 'es6',
    jsx: 'react',
    importHelpers: true,
    moduleResolution: 'node',
  },
  transpileOnly: true,
});

React.useLayoutEffect = () => {};

function renderApp(source, target, dist) {
  const sourceModule = require(source);
  const Page = sourceModule.default;
  const Layout = require('./Layout').default;
  const element = React.createElement(
    MemoryRouter,
    undefined,
    React.createElement(Layout, undefined, React.createElement(Page)),
  );

  return {
    content: renderToString(element),
    outPath: path.resolve(dist, target, 'index.html'),
  };
}

function makePage(dist, content, outPath) {
  const index = path.resolve(dist, 'index.html');
  const html = readFileSync(index, 'utf8');
  const outDir = path.dirname(outPath);
  const file = html.replace(/<div id="app">(.*)<\/div>/, `<div id="app">${content}</div>`);

  mkdirSync(outDir, {
    recursive: true,
  });

  writeFileSync(outPath, file, 'utf8');
}

function extendFiles(dist) {
  const files = readdirSync(path.resolve(dist, 'static'));
  ['.png', '.svg', '.jpg', '.jpeg', '.mp4', '.mp3', '.woff', '.tiff', '.tif', '.xml'].forEach((extension) => {
    require.extensions[extension] = (module, file) => {
      const parts = path.basename(file).split('.');
      const ext = parts.pop();
      const front = parts.join('.');
      const ref = files.filter((m) => m.startsWith(front) && m.endsWith(ext)).pop() || '';
      module.exports = '/static/' + ref;
    };
  });
}

const pages = [
  {
    target: 'about',
    entry: 'About.tsx',
  },
  {
    target: 'first',
    entry: 'First.tsx',
  },
  {
    target: 'second',
    entry: 'Second.tsx',
  },
  {
    target: '.',
    entry: 'Home.tsx',
  },
];

function generatePages() {
  const dist = path.resolve(__dirname, '..', 'dist');
  extendFiles(dist);

  pages.forEach(({ target, entry }) => {
    const { content, outPath } = renderApp(path.resolve(__dirname, 'pages', entry), target, dist);
    makePage(dist, content, outPath);
  });
}

generatePages();
