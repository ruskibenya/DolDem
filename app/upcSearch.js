//ToDo:
//  - How to break up into multiple files to organize output: subsidydata, violationData, bloomberg, etc
//  - Figure out what to do if violationData.record.length = 1 or subsidydata.record.length = 1
// Precompile handlebars templates

//require('handlebars');

window.upcSearch = {
 queryProducts: function (query, $brand, $manufacturer, $subsidies, $violations) {

    $.get('/products/' + query).then(function (response){


      //console.log("response: "+ response);
      var subsidyData = response.subsidyData;
      var violationData = response.violationData;
      var bloomberg = response.bloomberg;
      //console.log(subsidyData.record);
      //console.log("violationData: " +JSON.stringify(violationData));
      //console.log("subsidyData: "+ JSON.stringify(subsidyData.record.length));

      //handlebars compile for subsidies
      var sub_hndlbr_source = $("#subsidies-template").html();
      var subsidies_template = Handlebars.compile(sub_hndlbr_source);


      var subsidies = [];
      var subsidy;
      for (i=0; i<subsidyData.record.length; i++){

        subsidy = {
          company: subsidyData.record[i].company,
          parent_company: subsidyData.record[i].parent_company,
          subsidy_source: subsidyData.record[i].subsidy_source,
          location: subsidyData.record[i].location,
          city: subsidyData.record[i].city,
          county: subsidyData.record[i].county,
          description: subsidyData.record[i].description,
          subsidy_year: subsidyData.record[i].subsidy_year,
          subsidy_value: subsidyData.record[i].subsidy_amount_in_dollars,
          program_name: subsidyData.record[i].program,
          subsidy_type: subsidyData.record[i].subsidy_type,
          jobs_data: subsidyData.record[i].jobs_data,
          investment_data: subsidyData.record[i].investment_data,
          notes: subsidyData.record[i].notes
      }
      subsidies.push(subsidy);}
      $("#content-subsidies").html(template(subsidies));
      console.log(subsidies);
      //$subsidies.html(subsidies);



    //
    //   var violations = [];
    //   var violation;
    //   for (i=1; i<violationData.record.length; i++){
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
    //   console.log(violation);
    //   violations.push(violation);
    // }
    //   //$violations.html(violations);
    //   console.log(violations);



    //console.log("bloomberg: "+ JSON.stringify(bloomberg));





    }, function(err){
      alert(err.responseText);
    });
  }

};
