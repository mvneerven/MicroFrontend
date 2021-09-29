// https://esbuild.github.io/api/
const esbuild = require("esbuild");
const { markdownPlugin } = require("esbuild-plugin-markdown");

console.log("Building");

esbuild.build({
    plugins: [
        markdownPlugin()
    ],
    entryPoints: ['js/micro-frontend.js'],
    bundle: true,
    watch: {
      onRebuild(error, result) {
        if (error) console.error('watch build failed:', error)
        else console.log('watch build succeeded:', result)
      },
    },
    outfile: 'dist/micro-frontend.js',
  }).catch(ex => {
    console.error(ex);
    process.exit(1)
  })


  esbuild.build({
    plugins: [
        markdownPlugin()
    ],
    entryPoints: ['js/app1.js'],
    bundle: true,
    watch: {
      onRebuild(error, result) {
        if (error) console.error('watch build failed:', error)
        else console.log('watch build succeeded:', result)
      },
    },
    outfile: 'dist/app1.js',
  }).catch(ex => {
    console.error(ex);
    process.exit(1)
  })