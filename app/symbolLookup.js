function findSymbol (query){
  $.get("https://s.yimg.com/aq/autoc?query="+query+"&region=US&lang=en-US&callback=YAHOO.util.UHScriptNodeDataSource.callbacks").then(function(response){

    var results = JSON.parse(response);

    //ToDo store stock symbol of compnay
  })

}
