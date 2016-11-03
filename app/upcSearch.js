window.upcSearch = {
 queryProducts: function (query, $brand, $manufacturer) {

    $.get('/products/' + query).then(function (response){

      //var products = response;
      //parse twice because of parsing error not creating object
      var products = JSON.parse(response);
      //products = JSON.parse(products);


      //console.log(products.results[0]);
      //console.log(products.results[0].brand);
      //console.log(products.results_count);

      if (products.results_count === 0){
        alert(products.message);
      }
      else if (products.results){
        $brand.html("Brand: " + products.results[0].brand);
        $brand = products.results[0].brand.val;
        $manufacturer.html("Manufacturer:" + products.results[0].manufacturer);
        $manufacturer = products.results[0].manufacturer.val;
      }
    }, function(err){
      alert(err.responseText);
    });
  }

};
