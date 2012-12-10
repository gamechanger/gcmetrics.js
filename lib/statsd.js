/*
    Simple module charged simply with providing instances of node-dogstatsd.
 */

var StatsD = require('node-dogstatsd').StatsD,
    config = require('gcconfig');

exports.create = function() {
    return new StatsD(config.dogstatsd.host, config.dogstatsd.port);
};