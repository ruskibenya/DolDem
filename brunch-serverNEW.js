// Server start function
module.exports.startServer = function(cb) {
  //configure server
  var request = require('request');
  var express = require('express'),
      app = express();
  var async = require('async');
  var cheerio = require('cheerio');
  var serverLogic = require('./app/serverLogic3.js');
  var parentCoSearch = require('./app/parentCompanySearch.js');


      app.use(express.static('app'));
      //get data from browser to web-server
      
      app.get('/products/:query', function(req, res) {
        async.waterfall([
          function(req, callback){
            serverLogic.wholeEnchilada(req);
          }
        ], function asyncComplete(err, totalResults){
          if (err){
            console.log("startServer Error", err);
            res.status(500).send(err);
          } else {
            console.log("Successfully completed operation.");
            return res.status(200).send(totalResults);
          }
        })
      });

      app.listen(3333, function() {
            console.log('web server listening on port 3333');
        });

      cb();
};
