window.parentCompanySearch = {
queryParentCo: function(query, $parentCo) {

    $.get('/ParentCoResults/' + query).then(function(response) {

        console.log(response);


        var results = JSON.parse(response);
        var findShortestCW_id = function() {};

        if (results.meta.total_results === 0) {
            alert(results.meta.status_string);
        } else if (results.result.companies) {
            //for (i=results.meta.total_results; i>0; i--){

            //ToDo search for result with shortest cw_id
            //return parentCo company_name from shortest cw_id
            findShortestCW_id = function(array) {
                return array.reduce(function(prevCW_id, currCW_id) {
                    if (currCW_id.length < prevCW_id.length) {
                        return currCW_id;
                    } else
                        return prevCW_id;
                });
            };
            $parentCo = findShortestCW_id(results.result.companies);
            //}
        }



    }, function(err) {
        alert(err.responseText);
    });
}
};
