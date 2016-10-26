window.DolDem = {
 queryProducts: function (query, $brand, $manufacturer) {

    $.get('/products/' + query).then(function (response){

      //var products = response;
      //parse twice because of parsing error not creating object
      var products = JSON.parse(response);
      products = JSON.parse(products);


      //console.log(products.results[0]);
      console.log(products.results[0].brand);

      if (products.results){
        $brand.html("Brand: " + products.results[0].brand);
        $manufacturer.html("Manufacturer:" + products.results[0].manufacturer);
      }
    }, function(err){
      alert(err.responseText);
    });



/*
      if (products.message){
        $message.html(products.message);
      }
    }, function(err){
      alert(err.responseText);
    }); */
  }

};
