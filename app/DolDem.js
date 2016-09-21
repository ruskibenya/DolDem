/**
 * Makes an AJAX request to the /search endpoint of the API, using the
 * query string that was passed in
 *
 * if successful, updates model.browseItems appropriately and then invokes
 * the callback function that was passed in
 */

alert(window.jQuery)

 function searchUPC(query) {

console.log("searchUPC was called");

    // api credentials
    var api_key = 'SEM3AFEFE0A3431261B870FB7DC3BDF7FED2';
    var api_secret = 'N2JjNjlmNzEwNDliOTM4N2YxMTI3NWEwYTJhMWI5MjE';
    var sem3 = require('semantics3-node')(api_key,api_secret);

    //require(['semantics3'], function(sem3wall) {
      //var sem3 = sem3wall(api_key, api_secret)



      // build request from api
      sem3.products.products_field( "upc", query );
      sem3.products.products_field( "field", ["name","gtins"] );
      sem3.products.products_field( "offset", 1 );

      // Run the request
      sem3.products.get_products(
          function(err, products) {
              if (err) {
                  console.log("Couldn't execute request: get_products");
                  return;
              }

        // View the results of the request
          console.log( "Results of request:\n" + JSON.stringify( products ) );

          }
      );
    //};


}
