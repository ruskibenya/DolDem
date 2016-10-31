// Server start function
module.exports.startServer = function(cb) {

    //configure the server
    var express = require('express'),
        app = express();
    var async = require('async');

    app.use(express.static('app'));

    //get data from browser to web-server
    app.get('/products/:query', function(req, res) {

        // Semantics3 api credentials
        var api_key = 'SEM3AFEFE0A3431261B870FB7DC3BDF7FED2';
        var api_secret = 'N2JjNjlmNzEwNDliOTM4N2YxMTI3NWEwYTJhMWI5MjE';
        var sem3 = require('semantics3-node')(api_key, api_secret);


        async.waterfall([


            //first request to Semantics3/UPC Search
            function(callback) {
                // build request for api
                sem3.products.products_field("upc", req.params.query);
                sem3.products.products_field("field", ["name", "gtins"]);

                // Run the request
                sem3.products.get_products(
                    function(products) {
                        // View the results of the request
                        //console.log(products);
                        res.status(200).send(products);
                    }
                );
                callback();
            },

            function(callback) {

                //second request to corpwatch.org
                //find parent company name
                app.get('/ParentCoResults/:query', function(req, res) {

                  $.get("http://api.corpwatch.org/companies.json?company_name="+query, results){
                    //View the results of the request
                    console.log(results);
                    res.status(200).send(results);
                  }
                });
                callback();
            }
        ], function asyncComplete(err) { //the "complete" callback of `async.waterfall`
            if (err) { //there was an error with some earlier function

                //Semantics3 Error:
                //console.log("Couldn't excute request: get_products");
                //return callback(res.status(500).send('Unable to fetch products!'));

                //corpwatch Error:
                //console.log("Error");
                //return res.status(500).send("Unable to fetch results!");

                console.log("Error", err);
            } else {
                console.log("Successfully completed operation.");
            }
        });
    });




    app.listen(3333, function() {
        console.log('web server listening on port 3333');
    });

    cb();
};
