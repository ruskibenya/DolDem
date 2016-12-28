module.exports = {
  npm: {
        globals: {
            $: 'jquery'

  }},

  server:{run: true},

  files: {
      javascripts: {
        joinTo: {
        'vendor.js': /^(?!app)/,
        'app.js': /^app/,
      }
    },
    stylesheets: {
      joinTo: {
              "app.css": [/^vendor/, /^bower_components/, /^app/]
          },
          order: {
              after: [/^app/]
          }
    }
  },

  plugins: {
    babel: {presets: ['es2015']}
  }


};
