var express = require('express')
  , cors = require('cors')
  , app = express();

app.options('*', cors()); // include before other routes


app.listen(3333, function(){
  console.log('CORS-enabled web server listening on port 3333');
});
