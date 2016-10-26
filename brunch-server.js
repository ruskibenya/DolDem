// Server start function
module.exports.startServer = function(cb){

//configure the server
  var express = require('express')
    , app = express();

  app.use(express.static('app'));

  // api credentials
  var api_key = 'SEM3AFEFE0A3431261B870FB7DC3BDF7FED2';
  var api_secret = 'N2JjNjlmNzEwNDliOTM4N2YxMTI3NWEwYTJhMWI5MjE';
  var sem3 = require('semantics3-node')(api_key,api_secret);

  //get data from browser to web-server
  app.get('/products/:query', function(req, res){

  // build request from api
    sem3.products.products_field( "upc", req.params.query );
    sem3.products.products_field( "field", ["name","gtins"] );


  // Run the request
    sem3.products.get_products(
        function(err, products) {
            if (err) {
                console.log("Couldn't excute request: get_products");
                return res.status(500).send('Unable to fetch products!');
              }
              // View the results of the request
              console.log(products);
                res.status(200).send(products);
            }
          );

      });
      app.listen(3333, function(){
          console.log('web server listening on port 3333');
    });

    cb();
  };
