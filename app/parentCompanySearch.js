module.exports={
function min_cw_idSearch(results, min_cw_id, err,) {

    var results = results.body;
    results = JSON.parse(results);
    //console.log(results);
    var companiesList = results.result.companies;
    var cw_id_keys = [];
    for (var cw_id_key in companiesList) {
        if (companiesList.hasOwnProperty(cw_id_key)) {
            cw_id_keys.push(cw_id_key);
        }
    }

    var numResults = cw_id_keys.length;

    if (numResults === 0) {
        callback(new Error(results.meta.status_string));
    } else {
        //return shortest cw_id

        function findShortestCW_id() {
            var min = cw_id_keys[0];
            for (i = 1; i < numResults; i++) {
                var a = cw_id_keys[i];
                if (a.length < min.length) {
                    min = a;
                }
            }
            return min;
        }
        var min_cw_id = findShortestCW_id(results);
        //console.log(min_cw_id);
        return min_cw_id;
    },
    function(err) {
        callback(new Error(err.responseText));
    }
}
};
