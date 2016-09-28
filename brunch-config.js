module.exports = {
  npm: {
        globals: {
            $: 'jquery'
  }},

  files: {
    javascripts: {
      joinTo: {
        'vendor.js': /^(?!app)/,
        'app.js': /^app/,
/*     order: {
        before:{
          'app/assets/index.html'
          }
        after: {
          'app/DolDem.js'
        }
      } */
      }
    },
    stylesheets: {joinTo: 'app.css'}
  },

  plugins: {
    babel: {presets: ['es2015']}
  }
};
