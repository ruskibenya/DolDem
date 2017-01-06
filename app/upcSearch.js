//ToDo:
//  - How to break up into multiple files to organize output: subsidydata, violationData, bloomberg, etc
// Precompile handlebars templates


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

window.upcSearch = {
    queryProducts: function(query, $brand, $manufacturer, $subsidies, $violations, $co_profile_description) {

        $.get('/products/' + query).then(function(response) {

            var parentCo = response.parentCo;
            //console.log("response: "+ response);
            var subsidyData = response.subsidyData;
            var violationData = response.violationData;
            var bloomberg = response.bloomberg;
            var secretsSummary = response.secretsSummary;
            //console.log(secretsSummary);
            //console.log(subsidyData.record);
            //console.log("violationData: " +JSON.stringify(violationData.data.record.company));
            //console.log("subsidyData: " + JSON.stringify(subsidyData.record_count));

            //handlebars compile for subsidies
            var sub_hndlbr_source = $("#subsidies-template").html();
            var subsidies_template = Handlebars.compile(sub_hndlbr_source);

            var subsidies = [];
            var subsidy;
            if (subsidyData.record_count == 1) {
                subsidy = {
                    company: subsidyData.data.record.company,
                    parent_company: subsidyData.data.record.parent_company,
                    subsidy_source: subsidyData.data.record.subsidy_source,
                    location: subsidyData.data.record.location,
                    city: subsidyData.data.record.city,
                    county: subsidyData.data.record.county,
                    description: subsidyData.data.record.description,
                    subsidy_year: subsidyData.data.record.subsidy_year,
                    subsidy_value: subsidyData.data.record.subsidy_amount_in_dollars,
                    program_name: subsidyData.data.record.program,
                    subsidy_type: subsidyData.data.record.subsidy_type,
                    jobs_data: subsidyData.data.record.jobs_data,
                    investment_data: subsidyData.data.record.investment_data,
                    notes: subsidyData.data.record.notes
                }
                var context_sub = {
                    subsidy
                };
            } else {
                for (i = 0; i < subsidyData.record_count; i++) {

                    subsidy = {
                        company: subsidyData.data.record[i].company,
                        parent_company: subsidyData.data.record[i].parent_company,
                        subsidy_source: subsidyData.data.record[i].subsidy_source,
                        location: subsidyData.data.record[i].location,
                        city: subsidyData.data.record[i].city,
                        county: subsidyData.data.record[i].county,
                        description: subsidyData.data.record[i].description,
                        subsidy_year: subsidyData.data.record[i].subsidy_year,
                        subsidy_value: subsidyData.data.record[i].subsidy_amount_in_dollars,
                        program_name: subsidyData.data.record[i].program,
                        subsidy_type: subsidyData.data.record[i].subsidy_type,
                        jobs_data: subsidyData.data.record[i].jobs_data,
                        investment_data: subsidyData.data.record[i].investment_data,
                        notes: subsidyData.data.record[i].notes
                    }
                    subsidies.push(subsidy);
                }
                //console.log(subsidies);
                var context_sub = {
                    subsidies
                };
            }
            $("#subsidiesResults").html(subsidies_template(context_sub));
            //console.log(context);


            //handlebars compile for violations
            var vio_hndlbr_source = $("#violations-template").html();
            var violations_template = Handlebars.compile(vio_hndlbr_source);

            var violations = [];
            var violation;
            if (violationData.record_count == 1) {
                violation = {
                    company: violationData.data.record.company,
                    parent_company: violationData.data.record.parent_company,
                    location: violationData.data.record.location_state,
                    violation_city: violationData.data.record.city,
                    penalty_amount_in_dollars: numberWithCommas(violationData.data.record.penalty_amount_in_dollars),
                    primary_offense: violationData.data.record.primary_offense,
                    description: violationData.data.record.description,
                    penalty_year: violationData.data.record.penalty_year,
                    violation_agency: violationData.data.record.agency,
                    civil_criminal: violationData.data.record.civil_criminal,
                    hq_country_of_parent: violationData.data.record.hq_country_of_parent,
                    hq_state_of_parent: violationData.data.record.hq_state_of_parent,
                    ownership_structure_of_parent: violationData.data.record.ownership_structure_of_parent,
                    violation_notes: violationData.data.record.notes
                }
                var context_vio = {
                    violation
                };
            } else {
                for (i = 0; i < violationData.record_count; i++) {
                    violation = {
                        company: violationData.data.record[i].company,
                        parent_company: violationData.data.record[i].parent_company,
                        location: violationData.data.record[i].location_state,
                        violation_city: violationData.data.record[i].city,
                        penalty_amount_in_dollars: violationData.data.record[i].penalty_amount_in_dollars,
                        primary_offense: violationData.data.record[i].primary_offense,
                        description: violationData.data.record[i].description,
                        penalty_year: violationData.data.record[i].penalty_year,
                        violation_agency: violationData.data.record[i].agency,
                        civil_criminal: violationData.data.record[i].civil_criminal,
                        hq_country_of_parent: violationData.data.record[i].hq_country_of_parent,
                        hq_state_of_parent: violationData.data.record[i].hq_state_of_parent,
                        ownership_structure_of_parent: violationData.data.record[i].ownership_structure_of_parent,
                        violation_notes: violationData.data.record[i].notes
                    }
                    violations.push(violation);
                }
                var context_vio = {
                    violations
                };
            }


            $("#violationsResults").html(violations_template(context_vio));


            //console.log("bloomberg: "+ JSON.stringify(bloomberg.press_release));

            //handlebars compile for bloomberg execs
            var execs_source = $("#execs-template").html();
            var execs_template = Handlebars.compile(execs_source);
            var context_execs = bloomberg.execs;
            $("#execsResults").html(execs_template(context_execs));

            $("#co_profile_description").html(bloomberg.co_profile.description);
            $("#co_profile_address").html(bloomberg.co_profile.address);
            $("#co_profile_phone").html(bloomberg.co_profile.phone);
            $("#co_profile_website").html(bloomberg.co_profile.website);

            Handlebars.registerHelper("time_ago", function time_ago(time) {

                switch (typeof time) {
                    case 'number':
                        break;
                    case 'string':
                        time = +new Date(time);
                        break;
                    case 'object':
                        if (time.constructor === Date) time = time.getTime();
                        break;
                    default:
                        time = +new Date();
                }
                var time_formats = [
                    [60, 'seconds', 1], // 60
                    [120, '1 minute ago', '1 minute from now'], // 60*2
                    [3600, 'minutes', 60], // 60*60, 60
                    [7200, '1 hour ago', '1 hour from now'], // 60*60*2
                    [86400, 'hours', 3600], // 60*60*24, 60*60
                    [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
                    [604800, 'days', 86400], // 60*60*24*7, 60*60*24
                    [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
                    [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
                    [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
                    [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
                    [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
                    [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
                    [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
                    [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
                ];
                var seconds = (+new Date() - time) / 1000,
                    token = 'ago',
                    list_choice = 1;

                if (seconds == 0) {
                    return 'Just now'
                }
                if (seconds < 0) {
                    seconds = Math.abs(seconds);
                    token = 'from now';
                    list_choice = 2;
                }
                var i = 0,
                    format;
                while (format = time_formats[i++])
                    if (seconds < format[0]) {
                        if (typeof format[2] == 'string')
                            return format[list_choice];
                        else
                            return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
                    }
                return time;
            });

            var news_source = $("#news-template").html();
            var news_template = Handlebars.compile(news_source);
            var context_news = bloomberg.news;
            $("#newsResults").html(news_template(context_news));

            var press_source = $("#press-template").html();
            var press_template = Handlebars.compile(press_source);
            var context_press = bloomberg.press_release;
            $("#pressResults").html(press_template(context_press));

            //FIGURE OUT HOW TO DO href=
            //$("#co_profile_url")=bloomberg.co_profile.url;


            secretsSummary = {
              cycle: secretsSummary.cycle,
              total: numberWithCommas(secretsSummary.total),
              dems: numberWithCommas(secretsSummary.dems),
              repubs: numberWithCommas(secretsSummary.repubs),
              lobbying: numberWithCommas(secretsSummary.lobbying),
              mems_invested: secretsSummary.mems_invested,
              congress_percent: Number(Math.round((((secretsSummary.mems_invested)/535)*100)+'e2')+'e-2'),
              orgname: secretsSummary.orgname
            }


            var lobbying_source = $("#lobbying-template").html();
            var lobbying_template = Handlebars.compile(lobbying_source);
            var context_lobbying = secretsSummary;
            $("#lobbyingResults").html(lobbying_template(context_lobbying));





            //enter brand name in company facts title
            $("#parentCo").html(parentCo);


        }, function(err) {
            alert(err.responseText);
        });
    }

};
