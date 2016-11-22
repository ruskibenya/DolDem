var request = require('request');
var async = require('async');
var cheerio = require('cheerio');
var parentCoSearch = require('./parentCompanySearch.js');

//SECTION: presentation API functions

//Good Jobs First Functions, until 102
exports.violationTracker = function(parentCo, callback){
  async.waterfall([

    //Request VT1: scrape url for violationtracker
    function(parentCo, callback) {

        request("http://violationtracker.goodjobsfirst.org/prog.php?company="+parentCo, function(err, response, html) {

            var VTurl;
                // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
                var $ = cheerio.load(html);
                // We'll use the unique header class as a starting point.
                VTurl = $('.views-field.views-even').children().last().attr('href');
                //console.log("Request VT1(VTurl): "+VTurl);
                callback(err, VTurl);
        });
    },

    //Request VT2: get xml data from violation tracker from goodjobsfirst
    function(VTurl, callback) {

        //console.log("VT2 request(symbol): "+symbol);
        //console.log("VT2 request(parentCo): "+parentCo);
        request(VTurl + "&detail=xml_results", function(err, res) {

                var violationData = res.body;
                //console.log("VT2 request(violationData): "+violationData);
                callback(err, violationData);

        });
    }
  ], function asyncComplete(err, violationData){
    if (err){
      console.log("violationTracker Error", err);
      callback(err);
    }
    else{
      callback(violationData);
    }
  });
};

exports.subsidyTracker = function(parentCo, callback){
  async.waterfall([

    //Request ST1: scrape url for subsidyTracker
    function(parentCo, callback) {

        request("http://subsidytracker.goodjobsfirst.org/prog.php?company="+parentCo, function(err, response, html) {

            var STurl;
                // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
                var $ = cheerio.load(html);
                // We'll use the unique header class as a starting point.
                STurl = $('.views-field.views-even').children().last().attr('href');
                //console.log("Request VT1(VTurl): "+VTurl);
                callback(err, STurl);
        });
    },

    //Request ST2: get xml data from violation tracker from goodjobsfirst
    function(STurl, callback) {

        //console.log("ST2 request(symbol): "+symbol);
        //console.log("ST2 request(parentCo): "+parentCo);
        request(VTurl + "&detail=x", function(err, res) {

                var subsidyData = res.body;
                //console.log("ST2 request(subsidyData): "+subsidyData);
                callback(err, subsidyData);

        });
    }
  ], function asyncComplete(err, subsidyData){
    if (err){
      console.log("subsidyTracker Error", err);
      callback(err);
    }
    else{
      callback(subsidyData);
    }
  });
};


exports.GJFsearch = function(parentCo, callback){
  var GJFresults = {};
  async.series([
    function(callback){
      GJFresults.push(violationTracker(parentCo));
    },
    function(callback){
      GJFresults.push(subsidyTracker(parentCo));
    }
  ], function asyncComplete(err, GJFresults){
    if(err){
      console.log("GJFsearch Error");
      callback(err);
    }
    callback(GJFresults);
  })
};

//Bloomberg Functions
exports.bloombergSearch = function(parentCo, callback){
  async.waterfall([

    //blmbrg1 request, scrape stock symbol from Bloomberg
    function(parentCo, callback) {

        request("http://www.bloomberg.com/markets/symbolsearch?query=" + parentCo + "&commit=Find+Symbols.json", function(err, response, html) {

            var symbol;

                // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
                var $ = cheerio.load(html);

                // We'll use the unique header class as a starting point.
                symbol = $('.odd').children().first().text();
                //console.log("blmbrg1 request(symbol): "+symbol);
                callback(err, symbol);
        });
    },

    //blmbrg2 request, scrape Bloomberg for company profiles, execs, and news
    function(symbol, callback) {
        request("https://www.bloomberg.com/quote/"+symbol, function(err, response, html) {

            var profile;
            var news;
            var execs;
            var bloomberg;

                // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
                var $ = cheerio.load(html);

                // We'll use the unique header class as a starting point.
                news = $('.news.show');
                profile = $('.profile.show');
                execs = $('.management.show');
                bloomberg = {profile, news, execs};
                callback(err, bloomberg);
                // boardMembers don't load, issue

                //console.log("5th request(news): "+news);
                //console.log("5th request(profile): "+profile);
                //console.log("5th request(execs): "+execs);

        });
    }
  ], function asyncComplete(err, bloomberg){
    if (err){
      console.log("bloombergSearch Error");
      callback(err);
    }
    callback(bloomberg);
  })
};

// Open Secrets Functions, to be added to presentationAPIsearch
// openSecretsSearch : function(parentCo, callback){
//   async.waterfall([
//
//     //OS1 request, get orgID from openSecrets api
//     function(parentCo, callback) {
//
//     //openSecrets api_key
//     var key = "27ca23c2803eddb132adecd7238d4c94";
//     request('http://www.opensecrets.org/api/?method=getOrgs&org='+ parentCo+'&apikey='+key+'&output=json', function(err, results) {
//       if (!err){
//         var orgID = SOMETHING(results.body);
//         //console.log("OS1 request(orgID): "+results.body);
//       },
//     callback(err);
//     });
//     },
//
//     //OS2 request, get lobby info from openSecrets api
//     function(orgID, callback) {
//
//     request('http://www.opensecrets.org/api/?method=orgSummary&id='+orgID+'&apikey='+key+'&output=json', function(err, results) {
//         //var orgID = SOMETHING(results);
//         if (!err){
//           console.log("OS2 request(response): "+results.body);
//           var secretsSummary = SOMETHING(results);
//           callback(secretsSummary);
//         }
//         callback(err);
//     });
//     }
//   ], asyncComplete(err, secretsSummary){
//     if (err){
//       console.log("Open Secrets error");
//       callback(err);
//     },
//     callback(secretsSummary);
//   })
// },

exports.presentationAPIsearch = function(parentCo, callback){
  var APIsearchResults = {};
  async.parallel([
    function(callback){
      APIsearchResults.push(GJFsearch(parentCo));
    },
    function(callback){
      APIsearchResults.push(bloombergSearch(parentCo));
    }
    // ,
    // function(callback){
    //   openSecretsSearch(parentCo);
    // }
  ], function asyncComplete(err, APIsearchResults){
    if (err){
      console.log("presentationAPIsearch Error");
      callback(err);
    }
    callback(APIsearchResults);
  })
};



//SECTION: CORPWATCH
//search for parentCo to feed the presentationAPIsearch
exports.corpwatchSearch = function(someCompany, callback){
  async.waterfall([

    // request CW1, use company name to get min_cw_id
    function(callback){
      request('http://api.corpwatch.org/companies.json?company_name=' + someCompany, function(err, results) {
          //console.log(results.body);
            var min_cw_id = parentCoSearch.min_cw_idSearch(results);
            //console.log("CW1 request: "+parentCoSearch.min_cw_idSearch(results));
            callback(err, min_cw_id);
      });
    },
    //CW2 request, to corpwatch.org
    function(min_cw_id, callback) {
        //use min_cw_id to find parent name
        request('http://api.corpwatch.org/companies/' + min_cw_id, function(err, results) {
            var parentCo = parentCoSearch.parentCo_Query(results);
            //console.log("CW2 request(parentCo): "+parentCo);
            callback(err, parentCo);
        });
    }
  ], function asyncComplete(err, parentCo){
    if (err){
      console.log("corpwatchSearch Error");
      callback(err);
    }
    callback(parentCo);
  })
};

exports.cwPASwaterfall = function(someCompany, callback){
  async.waterfall([
    function(someCompany, callback){
      corpwatchSearch(someCompany);
    },
    function(parentCo, callback){
      presentationAPIsearch(parentCo);
    }
  ], function asyncComplete(err, APIsearchResults){
    if (err){
      console.log("cwPASwaterfall Error");
      callback(err);
    }
    callback(APIsearchResults);
  })
};


//SECTION: sem3

//run complete search for each related company
exports.searchForEach = function(relatedCompanies, callback){
    var totalResults={};
  async.forEach(Object.keys(relatedCompanies), function(company, callback){
      var companyResult = cwPASwaterfall(relatedCompanies[company]);
      totalResults.push(companyResult);
      callback(totalResults);
  }, function(err){
    console.log("searchForEach Error");
    callback(err);
  })
};

exports.relatedCompanies = function(req, callback){
  // build request for api
  //Sem3 api credentials
  var api_key = 'SEM3AFEFE0A3431261B870FB7DC3BDF7FED2',
      api_secret = 'N2JjNjlmNzEwNDliOTM4N2YxMTI3NWEwYTJhMWI5MjE',
      sem3 = require('semantics3-node')(api_key, api_secret);

  sem3.products.products_field("upc", req.params.query);
  sem3.products.products_field("field", ["name", "gtins"]);


  // Run the request
  sem3.products.get_products(
      function(err, products) {

          var products = JSON.parse(products);
          //console.log(products.results[0].brand);
          var brand = products.results[0].brand;
          var manufacturer = products.results[0].manufacturer;
          relatedCompanies = {brand, manufacturer};
          //console.log("relatedCompanies (brand): "+brand);
          //console.log("relatedCompanies (manufacturer): "+manufacturer);

          //checks that upc returned something
          if (products.results_count === 0) {
              callback (new Error(products.message));
              //passes Sem3 results down waterfall
          } else if (products.results) {
              callback(null, relatedCompanies);
          }
      });
};


exports.wholeEnchilada = function(req,callback){
  async.waterfall([
    function(req, callback){
      relatedCompanies(req);
    },
    function(relatedCompanies, callback){
      searchForEach(relatedCompanies);
    }
  ], function asyncComplete(err, totalResults){
    if (err){
      console.log("wholeEnchilada Error");
      callback(err);
    }
    callback(totalResults);
  })
};
