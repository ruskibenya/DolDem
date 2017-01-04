//ToDo:
//  - How to break up into multiple files to organize output: subsidydata, violationData, bloomberg, etc
//  - Figure out what to do if violationData.record.length = 1 or subsidydata.record.length = 1
// Precompile handlebars templates
//change ABC Company to parentCo

window.upcSearch = {
 queryProducts: function (query, $brand, $manufacturer, $subsidies, $violations, $co_profile_description) {

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
        subsidies.push(subsidy);
      }
      var context_sub = {subsidies};
      $("#subsidiesResults").html(subsidies_template(context_sub));
      //console.log(context);

    //
    //   //handlebars compile for violations
    //   var vio_hndlbr_source = $("#violations-template").html();
    //   var violations_template = Handlebars.compile(vio_hndlbr_source);
    //
    //
    //   var violations = [];
    //   var violation;
    //   for (i=0; i<violationData.record.length; i++){
    //
    //     violation = {
    //       company: violationData.record[i].company,
    //       parent_company: violationData.record[i].parent_company,
    //       location: violationData.record[i].location_state,
    //       violation_city: violationData.record[i].city,
    //       penalty_amount_in_dollars: violationData.record[i].penalty_amount_in_dollars,
    //       primary_offense: violationData.record[i].primary_offense,
    //       description: violationData.record[i].description,
    //       penalty_year: violationData.record[i].penalty_year,
    //       violation_agency: violationData.record[i].agency,
    //       civil_criminal: violationData.record[i].civil_criminal,
    //       hq_country_of_parent: violationData.record[i].hq_country_of_parent,
    //       hq_state_of_parent: violationData.record[i].hq_state_of_parent,
    //       ownership_structure_of_parent: violationData.record[i].ownership_structure_of_parent,
    //       violation_notes: violationData.record[i].notes
    //   }
    //   violations.push(violation);
    // }
    // var context_vio = {violations};
    // $("#violationsResults").html(violations_template(context_vio));


    console.log("bloomberg: "+ JSON.stringify(bloomberg.co_profile.description));

    //handlebars compile for bloomberg execs
    var execs_source = $("#execs-template").html();
    var execs_template = Handlebars.compile(execs_source);
    var context_execs = bloomberg.execs;
    $("#execsResults").html(execs_template(context_execs));

    $("#co_profile_description").html(bloomberg.co_profile.description);
    $("#co_profile_address").html(bloomberg.co_profile.address);
    $("#co_profile_phone").html(bloomberg.co_profile.phone);
    $("#co_profile_website").html(bloomberg.co_profile.website);
    //FIGURE OUT HOW TO DO href=
    //$("#co_profile_url")=bloomberg.co_profile.url;








    //enter brand name in company facts title
    //$brand.html($brand);


    }, function(err){
      alert(err.responseText);
    });
  }

};
