// Server start function
module.exports.startServer = function(){

  var express = require('express')
    , cors = require('cors')
    , app = express();

  app.use(cors());

  app.options('*', cors());

  app.listen(3333, function(){
    console.log('CORS-enabled web server listening on port 3333');
  });

}
