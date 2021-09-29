// https://esbuild.github.io/api/
const esbuild = require("esbuild");
const { markdownPlugin } = require("esbuild-plugin-markdown");

esbuild.build({
    plugins: [
        markdownPlugin()
    ],
    entryPoints: ['js/micro-frontend.js'],
    bundle: true,
    format: "esm",
    minify: true,
    outfile: 'dist/micro-frontend.min.js',
  }).catch(() => process.exit(1))


  esbuild.build({
    plugins: [
        markdownPlugin()
    ],
    entryPoints: ['js/app1.js'],
    bundle: true,
    format: "esm",
    minify: true,
    outfile: 'dist/app1.min.js',
  }).catch(() => process.exit(1))