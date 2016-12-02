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
        joinTo: {'css/vendor.css': /^node_modules/}
      }
  },

  plugins: {
    babel: {presets: ['es2015']}
  }


};
