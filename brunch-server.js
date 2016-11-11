var request = require('request');
var parentCoSearch = require('./app/parentCompanySearch.js');
var scraperjs = require('scraperjs');
var xmlparser = require('express-xml-bodyparser');
//var htmlParse = require('html-to-json');
var fs = require('file-system');
//remove this module (+code) --->>> var OpenSecretsClient = require('opensecrets-client');
//probably remove this too --->>> var OpenSecrets = require('opensecrets-js');


// Server start function
module.exports.startServer = function(cb) {

    //configure the server
    var express = require('express'),
        app = express();
    var async = require('async');
    var cheerio = require('cheerio');

    app.use(express.static('app'));
    app.use(xmlparser());

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
                            //console.log("1st request(products): "+products);

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
                //find min_cw_id
                function(products, callback) {

                    //convert upcSearch into $brand and $manufacturer
                    var brand = products[0].brand;
                    var manufacturer = products[0].manufacturer;
                    //console.log("2nd request(brand): "+brand);
                    //console.log("2nd request(manufacturer): "+manufacturer);


                    request('http://api.corpwatch.org/companies.json?company_name=' + brand, function(err, results) {
                        //console.log(results.body);

                        var min_cw_id = parentCoSearch.min_cw_idSearch(results);
                        //console.log(parentCoSearch.min_cw_idSearch(results));
                        callback(err, min_cw_id, products);

                    });
                },

                //third request, to corpwatch.org
                function(min_cw_id, products, callback) {

                    //use min_cw_id to find parent name
                    request('http://api.corpwatch.org/companies/' + min_cw_id, function(err, results) {
                        var parentCo = parentCoSearch.parentCo_Query(results);
                        //console.log("3rd request(parentCo): "+parentCo);
                        callback(err, parentCo, products);
                    });
                },

                //fourth request, scrape stock symbol from Bloomberg
                function(parentCo, products, callback) {

                    request("http://www.bloomberg.com/markets/symbolsearch?query=" + parentCo + "&commit=Find+Symbols.json", function(err, response, html) {

                        var symbol;
                        // First we'll check to make sure no errors occurred when making the request
                        if (!err) {

                            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
                            var $ = cheerio.load(html);

                            // We'll use the unique header class as a starting point.
                            symbol = $('.odd').children().first().text();
                            //console.log("4th request(symbol): "+symbol);
                        }

                        callback(err, symbol, parentCo, products);
                    });
                },

                //fifth request, scrape Bloomberg for company profiles, execs, and news
                function(symbol, parentCo, products, callback) {
                    scraperjs.DynamicScraper
                        .create("https://www.bloomberg.com/quote/" + symbol)
                        .scrape(function($) {
                            return $('html');
                        })
                        .then(function(result) {
                                fs.writeFile('./BloombergTest/JSONtest.json', JSON.stringify(result), function(err) {
                                    if (err) return console.log(err);
                                    console.log('TestResult worked');
                                })
                                                callback(err, bloomberg, symbol, parentCo, products);
                                            //    console.log(result);
                                            })

                    // request("https://www.bloomberg.com/quote/"+symbol, function(err, response, html) {
                    //
                    //     var profile;
                    //     // First we'll check to make sure no errors occurred when making the request
                    //     if (!err) {
                    //
                    //         // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
                    //         var $ = cheerio.load(html);
                    //
                    //         // We'll use the unique header class as a starting point.
                    //         profile = $('.profile_description').text();
                    //         console.log("5th request(profile): "+profile);
                    //     }
                    //
                    //     callback(err, profile, symbol, parentCo, products);
                    // });
                },

                //sixth request, scrape company news from Bloomberg
                // function(profile, symbol, parentCo, products, callback) {
                //
                //     scraperjs.DynamicScraper.create('https://www.bloomberg.com/quote/'+symbol)
                //     .scrape(function($){
                //       return $("news show").map(function(){
                //         return $(this).text();
                //       }).get();
                //     })
                //     .then(function(news){
                //       news.forEach(function(story){
                //         console.log(story);
                //       });
                //     });
                // },

                //seventh request, get orgID from openSecrets api
                //                 // function(symbol, parentCo, products, callback) {
                //                 //
                //                 //   //openSecrets api_key
                //                 //   var key = "27ca23c2803eddb132adecd7238d4c94";
                //                 //
                //                 //   opensecrets-client module try
                //                 //   var client = new OpenSecretsClient(key);
                //                 //   client.makeRequest('getOrgs',{id:parentCo, output: 'json'})
                //                 //     .on('complete', function(res){
                //                 //       if (res instanceof Error){
                //                 //       callback(new Error("Open Secrets couldn't getOrgs"));
                //                 //     }
                //                 //     else
                //                 //       console.log(res);
                //                 //       callback(null, res, products);
                //                 //     });
                //                 //
                //                 //   opensecrets-js module try
                //                 //   OpenSecrets.getOrgs(parentCo, function(res){
                //                 //     console.log(res);
                //                 //   });
                //
                //
                // /***** most simple http request no node module**/
                //                 //   request('http://www.opensecrets.org/api/?method=getOrgs&org='+ parentCo+'&apikey='+key+'&output=json', function(err, results) {
                //                 //       //var orgID = SOMETHING(results);
                //                 //       console.log("6th request(orgID): "+results.body);
                //                 //       callback(err, orgID, symbol, parentCo, products);
                //                 //   });
                //                 // },

                // //eigth request, get lobby info from openSecrets api
                // function(orgID, symbol, parentCo, products, callback) {
                //
                // request('http://www.opensecrets.org/api/?method=orgSummary&id='+orgID+'&apikey='+key+'&output=json', function(err, results) {
                //     //var orgID = SOMETHING(results);
                //     console.log("7th request(response): "+results.body);
                //     var secretsSummary = SOMETHING(results);
                //     callback(err, secretsSummary, products);
                // });
                // },

                //nineth request, get xml data from violation tracker of parent Co
                function(bloomberg, symbol, parentCo, products, callback) {

                    //console.log("8th request(symbol): "+symbol);
                    //console.log("8th request(parentCo): "+parentCo);
                    request("http://violationtracker.goodjobsfirst.org/prog.php?company=" + parentCo + "&datype=x", function(err, res) {

                        // First we'll check to make sure no errors occurred when making the request
                        if (!err) {
                            var violationData = res.body;
                            //console.log("8th request(violationData): "+violationData);
                            callback(null, violationData, symbol, parentCo, products);
                        } else {
                            callback(err, symbol, parentCo, products);
                        }
                    });
                },

                //tenth request, get xml data from subsidy tracker of parent Co
                function(violationData, symbol, parentCo, products, callback) {

                    // console.log("10th request(symbol): "+symbol);
                    // console.log("10th request(parentCo): "+parentCo);
                    request("http://subsidytracker.goodjobsfirst.org/prog.php?company=" + parentCo + "&datype=x", function(err, res) {

                        // First we'll check to make sure no errors occurred when making the request
                        if (!err) {
                            var subsidyData = res.body;
                            //console.log("9th request(subsidyData): "+subsidyData);
                            callback(null, violationData, symbol, parentCo, products);
                        } else {
                            callback(err, violationData, symbol, parentCo, products);
                        }
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
