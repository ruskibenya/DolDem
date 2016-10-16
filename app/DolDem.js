window.DolDem = {
 queryProducts: function (query, $message) {

    $.get('/products/' + query).then(function (response){

      var products = JSON.parse(response);

      console.log(products[0]);
      console.log(products[1]);
      console.log(products[2]);
      console.log(products[3]);
      console.log(products[4]);
      console.log(products[5]);
      console.log(products[6]);

      if (products.message){
        $message.html(products.message);
      }
    }, function(err){
      alert(err);
    });
  }

};
