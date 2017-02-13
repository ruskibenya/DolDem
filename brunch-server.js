
var request = require('request');
var parentCoSearch = require('./app/parentCompanySearch.js');



// Server start function
module.exports.startServer = function(cb) {

    //configure the server
    var express = require('express'),
        app = express();
    var async = require('async');
    var cheerio = require('cheerio');
    var util = require('util');


    // REMOVE THIS PROBABLY, used in subsidyDATA and violationData
    var parseString = require('xml2js').parseString;


    app.use(express.static('app'));
    // Semantics3 api credentials
    var api_key = 'SEM3AFEFE0A3431261B870FB7DC3BDF7FED2';
    var api_secret = 'N2JjNjlmNzEwNDliOTM4N2YxMTI3NWEwYTJhMWI5MjE';
    var sem3 = require('semantics3-node')(api_key, api_secret);

    //get data from browser to web-server
    app.get('/products/:query', function(req, res) {



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

                //second request, to corpwatch.org, find min_cw_id
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
                        callback(err, min_cw_id, brand);

                    });
                },

                //third request, to corpwatch.org
                function(min_cw_id, brand, callback) {

                    //use min_cw_id to find parent name
                    request('http://api.corpwatch.org/companies/' + min_cw_id, function(err, results) {
                        var parentCo = parentCoSearch.parentCo_Query(results);
                        //console.log("3rd request(parentCo): "+parentCo);
                        callback(err, parentCo, brand);
                    });
                },
                //fourth request, scrape stock symbol from Bloomberg
                function(parentCo, brand, callback) {
                    request("https://www.bloomberg.com/markets/symbolsearch?query="+parentCo+"&commit=Find+Symbols.json", function(err, response, html) {

                        var symbol;
                        // First we'll check to make sure no errors occurred when making the request
                        if (!err) {

                            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
                            //Seems weird response, using for testing
                            //console.log("html: "+html);
                            var $ = cheerio.load(html);

                            // We'll use the unique header class as a starting point.
                            symbol = $('.odd').children().first().text();
                            //console.log("4th request(symbol): "+symbol);
                        }

                        callback(err, symbol, parentCo, brand);
                    });
                },

                //fifth request, scrape Bloomberg for company profiles, execs, and news
                function(symbol, parentCo, brand, callback) {
                    request("https://www.bloomberg.com/quote/"+symbol, function(err, response, html) {

                        var co_profile = {};
                        var execs = {};
                        var news = {};
                        var press_release = {};
                        var bloomberg = {
                          execs:execs,
                          news:news,
                          press_release:press_release,
                          co_profile: co_profile};

                        // First we'll check to make sure no errors occurred when making the request
                        if (!err) {

                            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
                            var $ = cheerio.load(html);

                            //Get Company News and Press Releases
                            //Company News:
                              $(" .news__state.active > article").each(function(i){
                                //var time_published = $(this).first().text();
                                var time_published = $(this).children().attr('datetime');
                                var headline = $(this).children().last().text();
                                var article_url = $(this).children().last().children().attr('href');
                                //console.log(i+" "+headline);
                                bloomberg.news[i] = {time_published:time_published, headline:headline, article_url:article_url};
                              })
                              //console.log(bloomberg.news);

                              //Press Releases:
                                $("div[data-group='press-releases'] > article").each(function(i){
                                  //var time_published = $(this).first().text();
                                  var time_published = $(this).children().attr('datetime');
                                  var headline = $(this).children().last().text();
                                  var article_url = $(this).children().last().children().attr('href');
                                  //console.log(i+" "+headline);
                                  bloomberg.press_release[i] = {time_published:time_published, headline:headline, article_url:article_url};
                                })
                                //console.log(bloomberg.press_release);



                            //Get EXECUTIVES INFO: jobtitle, name, link to bloomberg profile
                            // boardMembers don't load, issue
                              $('.link').each(function(i){
                                var url = $(this).attr('href');
                                var name = $(this).attr('title');
                                var jobtitle = $(this).parent().parent().children().last().text();
                                bloomberg.execs[i] = {name:name, jobtitle:jobtitle, url:url};
                              })
                              //console.log(bloomberg.execs);

                              //Get Company profile: description, address, phone, website, url
                              var description = $('.profile__description').text();
                              //console.log(description);

                              var address = $('.profile__detail.profile__detail__address').clone().children().remove().end().text();
                              var phone = $('.profile__detail.profile__detail__address').next().clone().children().remove().end().text();
                              //console.log(website);
                              bloomberg.co_profile = {description:description, address:address, phone:phone};

                              $('.profile__detail__website_link').each(function(){
                                var website = $(this).text();
                                var url = $(this).attr('href');
                                //console.log(url);
                                bloomberg.co_profile.website = website;
                                bloomberg.co_profile.url = url;
                              })

                              //console.log(bloomberg);
                        }


                        callback(err, bloomberg, parentCo, brand);
                    });
                },

                //seventh request, get orgID from openSecrets api

                                 function (bloomberg, parentCo, brand, callback) {
                                   //openSecrets api_key
                                   var key = "27ca23c2803eddb132adecd7238d4c94";

                                   request('http://www.opensecrets.org/api/?method=getOrgs&org='+ parentCo+'&apikey='+key+'&output=xml', function(err, results) {
                                     // First we'll check to make sure no errors occurred when making the request
                                     if (!err) {
                                         var orgID = results.body;
                                         //console.log("6th request(orgID): "+JSON.stringify(orgID));
                                         parseString(orgID, {explicitArray: false}, function(err, result){
                                           if (! err){
                                             //console.log(JSON.stringify(result));
                                             orgID = result.response.organization.$.orgid;
                                             //console.log("orgID: "+orgID);
                                           }
                                         })
                                         //console.log("9th request(violationData): "+violationData);
                                         callback(null, orgID, parentCo, brand, bloomberg);
                                     } else {
                                         callback(err, bloomberg, brand, parentCo);
                                     }
                                   });
                                 },

                // //eigth request, get lobby info from openSecrets api
                function(orgID, parentCo, bloomberg, brand, callback) {
                  //openSecrets api_key
                  var key = "27ca23c2803eddb132adecd7238d4c94";

                request('http://www.opensecrets.org/api/?method=orgSummary&id='+orgID+'&apikey='+key+'&output=xml', function(err, results) {
                  // First we'll check to make sure no errors occurred when making the request
                  if (!err) {
                      var secretsSummary = results.body;
                      //console.log("6th request(orgID): "+JSON.stringify(orgID));
                      parseString(secretsSummary, {explicitArray: false}, function(err, result){
                        if (! err){
                          //console.log(JSON.stringify(result));
                          secretsSummary = result.response.organization.$;
                          //console.log("secretsSummary: "+JSON.stringify(secretsSummary));
                        }
                      })
                      callback(null, bloomberg, parentCo, brand, secretsSummary);
                  } else {
                      callback(err, bloomberg, parentCo, brand);
                  }
                });
                },


                // 8.5th request, scrape url for violationtracker
                function(bloomberg, parentCo, brand, secretsSummary, callback) {

                  //console.log(parentCo);

                    request("http://violationtracker.goodjobsfirst.org/prog.php?company="+parentCo, function(err, response, html) {

                        var VTurl;

                        // First we'll check to make sure no errors occurred when making the request
                        if (!err) {

                            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
                            //console.log("VTURL: "+html);
                            var $ = cheerio.load(html);

                            // We'll use the unique header class as a starting point.
                            VTurl = $('.views-field.views-even').children().last().attr('href');
                            //console.log("8.5th request(VTurl): "+VTurl);
                        }
                        if (VTurl === undefined){
                          VTurl = "try_again";
                          callback(err, VTurl, bloomberg, parentCo, brand, secretsSummary);
                        }
                        else{
                          callback(err, VTurl, bloomberg, parentCo, brand, secretsSummary);
                        }
                    });
                },

                //IF VTurl = undefined, try violationtracker url scraper again
                function(VTurl, brand, parentCo, bloomberg, secretsSummary, callback) {
                  //console.log("VTurl 3: "+VTurl);
                  if (VTurl === "try_again"){
                    request("http://violationtracker.goodjobsfirst.org/prog.php?company="+brand, function(err, response, html) {
                        // First we'll check to make sure no errors occurred when making the request
                        if (!err) {

                            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
                            //console.log("VTURL: "+html);
                            var $ = cheerio.load(html);

                            // We'll use the unique header class as a starting point.
                            VTurl = $('.views-field.views-even').children().last().attr('href');
                            //console.log("try again request(VTurl): "+VTurl);
                        }
                        callback(err, VTurl, bloomberg, parentCo, brand, secretsSummary);
                    });
                  }else{
                    callback(null, VTurl, bloomberg, parentCo, brand, secretsSummary);
                  }
                },


                //nineth request, get xml data from violation tracker from goodjobsfirst
                function(VTurl, bloomberg, parentCo, brand, secretsSummary, callback) {

                    //console.log("8th request(symbol): "+VTurl);
                    //console.log("8th request(parentCo): "+parentCo);
                    request(VTurl+"&detail=xml_results", function(err, res) {

                        // First we'll check to make sure no errors occurred when making the request
                        if (!err) {
                            var violationData = res.body;
                            //console.log("violationData: "+violationData);
                            parseString(violationData, {explicitArray: false}, function(err, result){
                              if (! err){
                                //console.log(JSON.stringify(result));
                                violationData = result.ViolationTrackerSearchResults;
                                //console.log(violationData);
                              }
                            })
                            //console.log("9th request(violationData): "+violationData);
                            callback(null, violationData, bloomberg, parentCo, brand, secretsSummary);
                        } else {
                            callback(err, bloomberg, parentCo, brand, secretsSummary);
                        }
                    });
                },

                // 9.5th request, scrape url for subsidy tracker
                function(violationData, bloomberg, parentCo, brand, secretsSummary, callback) {
                    request("http://subsidytracker.goodjobsfirst.org/prog.php?company="+parentCo, function(err, response, html) {

                        var STurl;
                        // First we'll check to make sure no errors occurred when making the request
                        if (!err) {

                            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
                            var $ = cheerio.load(html);

                            // We'll use the unique header class as a starting point.
                            STurl = $('.views-field.views-even').children().last().attr('href');
                            //console.log("9.5th request(STurl): "+STurl);
                        }
                        if (STurl === undefined){
                          STurl = "try_again";
                          callback(err, STurl, violationData, bloomberg, parentCo, brand, secretsSummary);
                        }
                        else{
                          callback(err, STurl, violationData, bloomberg, parentCo, brand, secretsSummary);
                        }


                    });
                },

                //If STurl = undefined, try subsidytracker url scraper again
                function(STurl, violationData, bloomberg, parentCo, brand, secretsSummary, callback){
                  //console.log("if STurl undefined: "+violationData);
                  //console.log("if STurl undefined: "+ brand);
                  //console.log("if STurl undefined: "+parentCo);
                  if (STurl === "try_again"){
                    request("http://subsidytracker.goodjobsfirst.org/prog.php?company="+brand, function(err, response, html) {
                        // First we'll check to make sure no errors occurred when making the request
                        if (!err) {

                            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
                            //console.log("VTURL: "+html);
                            var $ = cheerio.load(html);

                            // We'll use the unique header class as a starting point.
                            STurl = $('.views-field.views-even').children().last().attr('href');
                            //console.log("try again request(VTurl): "+VTurl);
                        }
                        callback(err, STurl, violationData, bloomberg, parentCo, secretsSummary);
                    });
                  }else{
                    callback(null, STurl, violationData, bloomberg, parentCo, secretsSummary);
                  }
                },


                //tenth request, get xml data from subsidy tracker from goodjobsfirst
                function(STurl, violationData, bloomberg, parentCo, secretsSummary, callback) {
                    // console.log("10th request(symbol): "+symbol);
                    //console.log("10th request(parentCo): "+STurl);
                    request(STurl + "&detail=x", function(err, res) {

                        // First we'll check to make sure no errors occurred when making the request
                        if (!err) {
                            var subsidyData = res.body;
                            parseString(subsidyData, {explicitArray: false}, function(err, result){
                              if (!err){
                                subsidyData = result.SubsidyTrackerSearchResults;
                                //console.log(subsidyData);
                              }
                            });
                            //console.log("10th request(subsidyData): "+subsidyData);
                            callback(null, subsidyData, violationData, bloomberg, parentCo, secretsSummary);
                        } else {
                            callback(err, violationData, bloomberg, parentCo, secretsSummary);
                        }
                    });
                }


            ],
            function asyncComplete(err, subsidyData, violationData, bloomberg, parentCo, secretsSummary) { //change results to companies
                if (err) { //there was an error with some earlier function

                    console.log("Error", err);
                    res.status(500).send(err.message);
                } else {
                    console.log("Successfully completed operation.");
                    return res.status(200).send({
                      subsidyData: subsidyData,
                      violationData: violationData,
                      bloomberg: bloomberg,
                      parentCo: parentCo,
                      secretsSummary: secretsSummary
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
