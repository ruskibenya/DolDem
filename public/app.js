!function(){"use strict";var e="undefined"==typeof global?self:global;if("function"!=typeof e.require){var r={},t={},a={},o={}.hasOwnProperty,n=/^\.\.?(\/|$)/,i=function(e,r){for(var t,a=[],o=(n.test(r)?e+"/"+r:r).split("/"),i=0,s=o.length;i<s;i++)t=o[i],".."===t?a.pop():"."!==t&&""!==t&&a.push(t);return a.join("/")},s=function(e){return e.split("/").slice(0,-1).join("/")},c=function(r){return function(t){var a=i(s(r),t);return e.require(a,r)}},d=function(e,r){var a=f&&f.createHot(e),o={id:e,exports:{},hot:a};return t[e]=o,r(o.exports,c(e),o),o.exports},u=function(e){return a[e]?u(a[e]):e},l=function(e,r){return u(i(s(e),r))},p=function(e,a){null==a&&(a="/");var n=u(e);if(o.call(t,n))return t[n].exports;if(o.call(r,n))return d(n,r[n]);throw new Error("Cannot find module '"+e+"' from '"+a+"'")};p.alias=function(e,r){a[r]=e};var _=/\.[^.\/]+$/,y=/\/index(\.[^\/]+)?$/,m=function(e){if(_.test(e)){var r=e.replace(_,"");o.call(a,r)&&a[r].replace(_,"")!==r+"/index"||(a[r]=e)}if(y.test(e)){var t=e.replace(y,"");o.call(a,t)||(a[t]=e)}};p.register=p.define=function(e,a){if(e&&"object"==typeof e)for(var n in e)o.call(e,n)&&p.register(n,e[n]);else r[e]=a,delete t[e],m(e)},p.list=function(){var e=[];for(var t in r)o.call(r,t)&&e.push(t);return e};var f=e._hmr&&new e._hmr(l,p,r,t);p._cache=t,p.hmr=f&&f.wrap,p.brunch=!0,e.require=p}}(),function(){var e;"undefined"==typeof window?this:window;require.register("BarcodeReader.js",function(e,r,t){"use strict"}),require.register("initialize.js",function(e,r,t){"use strict";document.addEventListener("DOMContentLoaded",function(){var e=r("jquery");console.log("Tasty Brunch, just trying to use jQuery!",e("body")),console.log("Initialized app")})}),require.register("parentCompanySearch.js",function(e,r,t){"use strict";t.exports={min_cw_idSearch:function(e,r,t){var e=e.body;e=JSON.parse(e);var a=e.result.companies,o=[];for(var n in a)a.hasOwnProperty(n)&&o.push(n);var s=o.length;if(0===s)return new Error(e.meta.status_string);var c=function(){var e=o[0];for(i=1;i<s;i++){var r=o[i];r.length<e.length&&(e=r)}return e},r=c(e);return r},parentCo_Query:function(e,r,t){var e=e.body;e=JSON.parse(e);var a=e.result.companies;for(var o in a)if(a.hasOwnProperty(o)){var r=e.result.companies[o].company_name;return r}}}}),require.register("upcSearch.js",function(e,r,t){"use strict";function a(e){return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};window.upcSearch={queryProducts:function(e,r,t,n,s,c){$.get("/products/"+e).then(function(e){var r,t=e.parentCo,n=e.subsidyData,s=e.violationData,c=e.bloomberg,d=e.secretsSummary,u=$("#subsidies-template").html(),l=Handlebars.compile(u),p=[];if(1==n.record_count){r={company:n.data.record.company,parent_company:n.data.record.parent_company,subsidy_source:n.data.record.subsidy_source,location:n.data.record.location,city:n.data.record.city,county:n.data.record.county,description:n.data.record.description,subsidy_year:n.data.record.subsidy_year,subsidy_value:n.data.record.subsidy_amount_in_dollars,program_name:n.data.record.program,subsidy_type:n.data.record.subsidy_type,jobs_data:n.data.record.jobs_data,investment_data:n.data.record.investment_data,notes:n.data.record.notes},p.push(r);var _={subsidies:p}}else{for(i=0;i<n.record_count;i++)r={company:n.data.record[i].company,parent_company:n.data.record[i].parent_company,subsidy_source:n.data.record[i].subsidy_source,location:n.data.record[i].location,city:n.data.record[i].city,county:n.data.record[i].county,description:n.data.record[i].description,subsidy_year:n.data.record[i].subsidy_year,subsidy_value:n.data.record[i].subsidy_amount_in_dollars,program_name:n.data.record[i].program,subsidy_type:n.data.record[i].subsidy_type,jobs_data:n.data.record[i].jobs_data,investment_data:n.data.record[i].investment_data,notes:n.data.record[i].notes},p.push(r);var _={subsidies:p}}$("#subsidiesResults").html(l(_));var y,m=$("#violations-template").html(),f=Handlebars.compile(m),b=[];if(1==s.record_count){y={company:s.data.record.company,parent_company:s.data.record.parent_company,location:s.data.record.location_state,violation_city:s.data.record.city,penalty_amount_in_dollars:a(s.data.record.penalty_amount_in_dollars),primary_offense:s.data.record.primary_offense,description:s.data.record.description,penalty_year:s.data.record.penalty_year,violation_agency:s.data.record.agency,civil_criminal:s.data.record.civil_criminal,hq_country_of_parent:s.data.record.hq_country_of_parent,hq_state_of_parent:s.data.record.hq_state_of_parent,ownership_structure_of_parent:s.data.record.ownership_structure_of_parent,violation_notes:s.data.record.notes},b.push(y);var h={violations:b}}else{for(i=0;i<s.record_count;i++)y={company:s.data.record[i].company,parent_company:s.data.record[i].parent_company,location:s.data.record[i].location_state,violation_city:s.data.record[i].city,penalty_amount_in_dollars:a(s.data.record[i].penalty_amount_in_dollars),primary_offense:s.data.record[i].primary_offense,description:s.data.record[i].description,penalty_year:s.data.record[i].penalty_year,violation_agency:s.data.record[i].agency,civil_criminal:s.data.record[i].civil_criminal,hq_country_of_parent:s.data.record[i].hq_country_of_parent,hq_state_of_parent:s.data.record[i].hq_state_of_parent,ownership_structure_of_parent:s.data.record[i].ownership_structure_of_parent,violation_notes:s.data.record[i].notes},b.push(y);var h={violations:b}}$("#violationsResults").html(f(h));var v=$("#execs-template").html(),g=Handlebars.compile(v),w=c.execs;$("#execsResults").html(g(w)),$("#co_profile_description").html(c.co_profile.description),$("#co_profile_address").html(c.co_profile.address),$("#co_profile_phone").html(c.co_profile.phone),$("#co_profile_website").html(c.co_profile.website),$("#co_profile_website").attr("href",c.co_profile.url),Handlebars.registerHelper("time_ago",function(e){switch("undefined"==typeof e?"undefined":o(e)){case"number":break;case"string":e=+new Date(e);break;case"object":e.constructor===Date&&(e=e.getTime());break;default:e=+new Date}var r=[[60,"seconds",1],[120,"1 minute ago","1 minute from now"],[3600,"minutes",60],[7200,"1 hour ago","1 hour from now"],[86400,"hours",3600],[172800,"Yesterday","Tomorrow"],[604800,"days",86400],[1209600,"Last week","Next week"],[2419200,"weeks",604800],[4838400,"Last month","Next month"],[29030400,"months",2419200],[58060800,"Last year","Next year"],[290304e4,"years",29030400],[580608e4,"Last century","Next century"],[580608e5,"centuries",290304e4]],t=(+new Date-e)/1e3,a="ago",n=1;if(0==t)return"Just now";t<0&&(t=Math.abs(t),a="from now",n=2);for(var i,s=0;i=r[s++];)if(t<i[0])return"string"==typeof i[2]?i[n]:Math.floor(t/i[2])+" "+i[1]+" "+a;return e});var q=$("#news-template").html(),j=Handlebars.compile(q),x=c.news;$("#newsResults").html(j(x));var S=$("#press-template").html(),H=Handlebars.compile(S),D=c.press_release;$("#pressResults").html(H(D)),d={cycle:d.cycle,total:a(d.total),dems:a(d.dems),repubs:a(d.repubs),lobbying:a(d.lobbying),mems_invested:d.mems_invested,congress_percent:Number(Math.round(d.mems_invested/535*100+"e2")+"e-2"),orgname:d.orgname,source:"http://"+d.source};var N=$("#lobbying-template").html(),R=Handlebars.compile(N),k=d;$("#lobbyingResults").html(R(k)),$("#parentCo").html(t)},function(e){alert(e.responseText)})}}}),require.alias("process/browser.js","process"),e=require("process"),require.register("___globals___",function(e,r,t){window.$=r("jquery")})}(),require("___globals___");