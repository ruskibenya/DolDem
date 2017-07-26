module.exports = {
  files: {
    javascripts: {
      joinTo: {
        'vendor.js': /^(?!app)/,
        'app.js': /^app/
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
  }
};
