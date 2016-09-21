module.exports = {
  npm: {
        globals: {
            $: 'jquery'
  }},

  files: {
    javascripts: {
      joinTo: {
        'libraries.js': /^(?!app)/,
        'vendor.js': /^(?!app)/,
        'app.js': /^app/
      }
    },
    stylesheets: {joinTo: 'app.css'}
  },

  plugins: {
    babel: {presets: ['es2015']}
  }
};
