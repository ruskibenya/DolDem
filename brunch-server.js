var request = require('request');
var parentCoSearch = require("./parentCompanySearch.js");

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
                                function(err, products) {
                                    //console.log(products);

                                    var products = JSON.parse(products);
                                    //checks that upc returned something
                                    if (products.results_count === 0) {
                                        callback(new Error(products.message));
                                        //passes Sem3 results down waterfall
                                    } else if (products.results) {
                                        callback(null, products.results);
                                    }
                                });
                        },

                        //second request, to corpwatch.org
                        function(products, callback) {
                            //find parent company name

                            //convert upcSearch into $brand and $manufacturer
                            var brand = products[0].brand;
                            var manufacturer = products[0].manufacturer;

                            //find parent company of brand
                            request('http://api.corpwatch.org/companies.json?company_name=' + brand, function(err, results) {
                                        //console.log(results.body);

                                        min_cw_idSearch(results) {
                                          callback(err, min_cw_id, products);
                                        }

                                        });
                                },

                        //third request, to corpwatch.org
                        function(min_cw_id, products, callback) {

                            //use min_cw_id to find parent name
                            request('http://api.corpwatch.org/companies/' + min_cw_id, function(err, results) {
                                                        console.log(results);

                                            callback(err, results, products);
                                        });
                                 }


                                ],
                                function asyncComplete(err, results, products) { //change results to companies
                                    if (err) { //there was an error with some earlier function

                                        console.log("Error", err);
                                        res.status(500).send(err.message);
                                    } else {
                                        //console.log("Successfully completed operation.");
                                        return res.status(200).send({
                                            //companies: companies,
                                            products: products
                                        });
                                    }
                                }
                        );

                    });




                    app.listen(3333, function() {
                        console.log('web server listening on port 3333');
                    });

                    cb();
                };
