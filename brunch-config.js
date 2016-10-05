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
      }
    },
    stylesheets: {joinTo: 'app.css'}
  },

  plugins: {
    babel: {presets: ['es2015']}
  }


};
