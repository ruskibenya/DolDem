//ToDo:
//  - How to break up into multiple files to organize output: subsidydata, violationData, bloomberg, etc
//  - Figure out what to do if violationData.record.length = 1 or subsidydata.record.length = 1

window.upcSearch = {
 queryProducts: function (query, $brand, $manufacturer, $subsidies, $violations) {

    $.get('/products/' + query).then(function (response){

      //response = JSON.parse(response);
      //console.log("response: "+ response.subsidyData.record[0].location);
      var subsidyData = response.subsidyData;
      var violationData = response.violationData;
      var bloomberg = response.bloomberg;
      //console.log("violationData: " +JSON.stringify(violationData.record.length));
      //console.log("subsidyData: "+ JSON.stringify(subsidyData.record.length));


      // var subsidies = [];
      // var subsidy;
      // for (i=0; i<subsidyData.record.length; i++){
      //
      //   subsidy = (
      //     "Company: " + subsidyData.record[i].company + "<br>" +
      //     "Parent Company: " + subsidyData.record[i].parent_company + "<br>" +
      //     "Source of Subsidy: "+ subsidyData.record[i].subsidy_source + "<br>"+
      //     "Location: " + subsidyData.record[i].location + "<br>"+
      //     "City: " + subsidyData.record[i].city + "<br>"+
      //     "County: " + subsidyData.record[i].county + "<br>"+
      //     "Description: " + subsidyData.record[i].description + "<br>"+
      //     "Subsidy Year: " + subsidyData.record[i].subsidy_year + "<br>"+
      //     "Subsidy Value: " + subsidyData.record[i].subsidy_amount_in_dollars +"<br>"+
      //     "Program Name: " + subsidyData.record[i].program + "<br>"+
      //     "Type of Subsidy: " + subsidyData.record[i].subsidy_type + "<br>"+
      //     "Number of Jobs: " + subsidyData.record[i].jobs_data + "<br>"+
      //     "Capital Investment: " + subsidyData.record[i].investment_data + "<br>"+
      //     "Notes: " + subsidyData.record[i].notes + "<br>"
      // )
      // subsidies.push(subsidy);}
      // $subsidies.html(subsidies);




    //   var violations = [];
    //   var violation;
    //   for (i=0; i<violationData.record.length; i++){
    //
    //     violation = (
    //       "Company: " + violationData.record[i].company + "<br>" +
    //       "Parent Company: " + violationData.record[i].parent_company + "<br>" +
    //       "Location: " + violationData.record[i].location_state + "<br>"+
    //       "City: " + violationData.record[i].city + "<br>"+
    //       "Penalty Value: " + violationData.record[i].penalty_amount_in_dollars +"<br>"+
    //       "Primary Offense" + violationData.record[i].primary_offense + "<br>" +
    //       "Description: " + violationData.record[i].description + "<br>"+
    //       "Penalty Year: " + violationData.record[i].penalty_year + "<br>"+
    //       "Agency:" + violationData.record[i].agency + "<br>" +
    //       "Civil or Criminal Case:" + violationData.record[i].civil_criminal + "<br>"+
    //       "HQ Country of Parent Compnay:" + violationData.record[i].hq_country_of_parent + "<br>" +
    //       "HQ State of Parent Company:" + violationData.record[i].hq_state_of_parent + "<br>" +
    //       "Ownership Structure of Parent Compnay:" + violationData.record[i].ownership_structure_of_parent + "<br>" +
    //       "Notes: " + violationData.record[i].notes + "<br>"
    //   )
    //   violations.push(violation);
    // }
    //   $violations.html(violations);



    console.log("bloomberg: "+ JSON.stringify(bloomberg));




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
