/*
    General purpose metrics logging module. This module takes care of
    setting up the appropriate metrics logging client (currently
    dogstatsd), allowing tag and path contexts to be added/removed
    via a consistent API which can be consumed by the rest of the app.
 */

var StatsD = require('node-dogstatsd').StatsD,
    _s = require('underscore.string'),
    config = require('gcconfig');

var PREFIX = require(process.cwd() + '/package').name +  '.';

var statsd = new StatsD(config.dogstatsd.host, config.dogstatsd.port);

exports.timing = function(stat, time, sample_rate, tags) {
    statsd.timing(PREFIX + stat, time, sample_rate, tags);
};

exports.increment = function(stat, sample_rate, tags) {
    statsd.increment(PREFIX + stat, sample_rate, tags);
};

exports.decrement = function(stat, sample_rate, tags) {
    statsd.decrement(PREFIX + stat, sample_rate, tags);
};

exports.gauge = function(stat, value, sample_rate, tags) {
    statsd.gauge(PREFIX + stat, value, sample_rate, tags);
};

exports.histogram = function(stat, value, sample_rate, tags) {
    statsd.histogram(PREFIX + stat, value, sample_rate, tags);
};

exports.timed = function(stat, fn, tags) {
    var start = Date.now();
    fn(function() {
        // TODO: Make this sampleable
        exports.timing(stat, Date.now() - start, 1, tags);
    });
};