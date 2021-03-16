const routes = require('next-routes')(); //Require statement returns a function and is invoked when file loaded

routes
    .add('/campaigns/new', '/campaigns/new')
    .add('/campaigns/:address', '/campaigns/show')
    .add('/campaigns/:address/requests','/campaigns/requests/index')
    .add('/campaigns/:address/requests/new','campaigns/requests/new'); //Colon used to identify wildcard portion of URL
//Order of add statements matters!

module.exports = routes;  //Exports helpers