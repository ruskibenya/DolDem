(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var process;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("BarcodeReader.js", function(exports, require, module) {
"use strict";

function openReader() {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            constraints: {
                width: 640,
                height: 480,
                facingMode: "environment"
            }
        },
        locator: {
            patchSize: "medium",
            halfSample: true
        },
        numOfWorkers: 4,
        locate: true,
        decoder: {
            readers: ["upc_reader", "upc_e_reader"]
        }
    }, function () {
        Quagga.start();
    });

    Quagga.onDetected(function (result) {
        var code = result.codeResult.code;
        //console.log("The code is "+code);

        var $form = $("#form-search");

        $form.find("input[name='query']").val(code);
        Quagga.stop();
        $form.submit();
    });
}

});

;require.register("initialize.js", function(exports, require, module) {
'use strict';

document.addEventListener('DOMContentLoaded', function () {
  // do your setup here


  // delete if jquery script in index is necessary
  var $ = require('jquery');
  console.log('Tasty Brunch, just trying to use jQuery!', $('body'));

  console.log('Initialized app');
});

});

require.register("parentCompanySearch.js", function(exports, require, module) {
"use strict";

module.exports = {
    min_cw_idSearch: function min_cw_idSearch(results, min_cw_id, err) {

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
            return new Error(results.meta.status_string);
        } else {
            //return shortest cw_id

            var findShortestCW_id = function findShortestCW_id() {
                var min = cw_id_keys[0];
                for (i = 1; i < numResults; i++) {
                    var a = cw_id_keys[i];
                    if (a.length < min.length) {
                        min = a;
                    }
                }
                return min;
            };

            var min_cw_id = findShortestCW_id(results);
            //console.log(min_cw_id);
            return min_cw_id;
        } //,
        // function(err) {
        //     callback(new Error(err.responseText));
        // }
    },

    parentCo_Query: function parentCo_Query(results, parentCo, err) {
        var results = results.body;
        results = JSON.parse(results);
        //console.log(results);
        var companiesList = results.result.companies;
        for (var cw_id_key in companiesList) {
            if (companiesList.hasOwnProperty(cw_id_key)) {
                var parentCo = results.result.companies[cw_id_key].company_name;
                return parentCo;
            }
        }
    }
};

});

require.register("upcSearch.js", function(exports, require, module) {
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

window.upcSearch = {
    queryProducts: function queryProducts(query, $brand, $manufacturer, $subsidies, $violations, $co_profile_description) {

        $.get('/products/' + query).then(function (response) {

            var parentCo = response.parentCo;
            //console.log("response: "+ response);
            var subsidyData = response.subsidyData;
            var violationData = response.violationData;
            var bloomberg = response.bloomberg;
            var secretsSummary = response.secretsSummary;
            //console.log(secretsSummary);
            //console.log("bloomberg: "+JSON.stringify(bloomberg));
            //console.log("violationData: " +JSON.stringify(violationData));
            //console.log("subsidyData: " + JSON.stringify(subsidyData));

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
                };
                subsidies.push(subsidy);
                var context_sub = {
                    subsidies: subsidies
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
                    };
                    subsidies.push(subsidy);
                }
                //console.log(subsidies);
                var context_sub = {
                    subsidies: subsidies
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
                };
                violations.push(violation);

                var context_vio = { violations: violations };
            } else {
                for (i = 0; i < violationData.record_count; i++) {
                    violation = {
                        company: violationData.data.record[i].company,
                        parent_company: violationData.data.record[i].parent_company,
                        location: violationData.data.record[i].location_state,
                        violation_city: violationData.data.record[i].city,
                        penalty_amount_in_dollars: numberWithCommas(violationData.data.record[i].penalty_amount_in_dollars),
                        primary_offense: violationData.data.record[i].primary_offense,
                        description: violationData.data.record[i].description,
                        penalty_year: violationData.data.record[i].penalty_year,
                        violation_agency: violationData.data.record[i].agency,
                        civil_criminal: violationData.data.record[i].civil_criminal,
                        hq_country_of_parent: violationData.data.record[i].hq_country_of_parent,
                        hq_state_of_parent: violationData.data.record[i].hq_state_of_parent,
                        ownership_structure_of_parent: violationData.data.record[i].ownership_structure_of_parent,
                        violation_notes: violationData.data.record[i].notes
                    };
                    //console.log(violation);
                    violations.push(violation);
                }
                //console.log(violations);
                var context_vio = { violations: violations };
            }

            $("#violationsResults").html(violations_template(context_vio));

            //handlebars compile for bloomberg execs
            var execs_source = $("#execs-template").html();
            var execs_template = Handlebars.compile(execs_source);
            var context_execs = bloomberg.execs;
            $("#execsResults").html(execs_template(context_execs));

            $("#co_profile_description").html(bloomberg.co_profile.description);
            $("#co_profile_address").html(bloomberg.co_profile.address);
            $("#co_profile_phone").html(bloomberg.co_profile.phone);
            $("#co_profile_website").html(bloomberg.co_profile.website);
            $("#co_profile_website").attr("href", bloomberg.co_profile.url);

            Handlebars.registerHelper("time_ago", function time_ago(time) {

                switch (typeof time === "undefined" ? "undefined" : _typeof(time)) {
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
                var time_formats = [[60, 'seconds', 1], // 60
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
                    return 'Just now';
                }
                if (seconds < 0) {
                    seconds = Math.abs(seconds);
                    token = 'from now';
                    list_choice = 2;
                }
                var i = 0,
                    format;
                while (format = time_formats[i++]) {
                    if (seconds < format[0]) {
                        if (typeof format[2] == 'string') return format[list_choice];else return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
                    }
                }return time;
            });

            var news_source = $("#news-template").html();
            var news_template = Handlebars.compile(news_source);
            var context_news = bloomberg.news;
            $("#newsResults").html(news_template(context_news));

            //console.log("bloomberg: "+ JSON.stringify(bloomberg.press_release));

            var press_source = $("#press-template").html();
            var press_template = Handlebars.compile(press_source);
            var context_press = bloomberg.press_release;
            $("#pressResults").html(press_template(context_press));

            //console.log(secretsSummary);
            secretsSummary = {
                cycle: secretsSummary.cycle,
                total: numberWithCommas(secretsSummary.total),
                dems: numberWithCommas(secretsSummary.dems),
                repubs: numberWithCommas(secretsSummary.repubs),
                lobbying: numberWithCommas(secretsSummary.lobbying),
                mems_invested: secretsSummary.mems_invested,
                congress_percent: Number(Math.round(secretsSummary.mems_invested / 535 * 100 + 'e2') + 'e-2'),
                orgname: secretsSummary.orgname,
                source: "http://" + secretsSummary.source
            };

            var lobbying_source = $("#lobbying-template").html();
            var lobbying_template = Handlebars.compile(lobbying_source);
            var context_lobbying = secretsSummary;
            $("#lobbyingResults").html(lobbying_template(context_lobbying));

            //enter brand name in company facts title
            $("#parentCo").html(parentCo);
        }, function (err) {
            alert(err.responseText);
        });
    }

};

});

require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  

// Auto-loaded modules from config.npm.globals.
window["$"] = require("jquery");


});})();require('___globals___');


//# sourceMappingURL=app.js.map