window.DolDem = {
 queryProducts: fuction (query, $message) {

    $.get('/products/' + query).then(function (response){

      var products = JSON.parse(response);

      if (products.message){
        $message.html(products.message);
      }
    }, function(err){
      alert(err);
    });
  }

};
