/*
    General purpose metrics logging module. This module takes care of
    setting up the appropriate metrics logging client (currently
    dogstatsd), allowing tag and path contexts to be added/removed
    via a consistent API which can be consumed by the rest of the app.
 */

var statsd = require('./statsd').create(),
    _s = require('underscore.string'),
    _ = require('underscore');

console.log(statsd);

var PREFIX = require(process.cwd() + '/package').name +  '.';

/**
 * Converts tag "objects" to arrays if necessary.
 *
 * e.g. {foo: "bar"} -> ['foo:bar']
 * @param  {Object or Array} tags the Object or Array
 * @return {Array}      The original array or converted object.
 */
var convertTagsIfRequired = function(tags) {
    if (!_.isArray(tags)) {
        return _.map(tags, function(value, key) {
            return key + ":" + value;
        });
    }
    return tags;
};

/**
 * Logs a timing metric.
 * @param  {String} stat            The stat key
 * @param  {Number} time            The timing value in ms
 * @param  {Number} sample_rate     The rate at which to sample this metric. 
 *                                  Defaults to 1 if omitted. Optional.
 * @param  {Array or Object} tags   Tags to tag the metric with. This can either 
 *                                  be an Array (e.g. ['foo', 'bar']) or an
 *                                  Object (e.g. {foo:'bar'}). Optional.
 */
exports.timing = function(stat, time, sample_rate, tags) {
    if (arguments.length === 3) {
        if (_.isArray(sample_rate) || _.isObject(sample_rate)) {
            tags = sample_rate;
            sample_rate = 1;
        }
    } else if (arguments.length === 2) {
        sample_rate = 1;
    }

    statsd.timing(PREFIX + stat, time, sample_rate, convertTagsIfRequired(tags));
};


/**
 * increments a stat count
 * @param  {String} stat        The stat key
 * @param  {Number} sample_rate The sample rate (optional)
 * @param  {Array or Object} tags        The tags associated with the metric (optional)
 */
exports.increment = function(stat, sample_rate, tags) {
    if (arguments.length === 2) {
        if (_.isArray(sample_rate) || _.isObject(sample_rate)) {
            tags = sample_rate;
            sample_rate = 1;
        }
    } else if (arguments.length === 1) {
        sample_rate = 1;
    }

    statsd.increment(PREFIX + stat, sample_rate, convertTagsIfRequired(tags));
};

/**
 * decrements a stat count
 * @param  {String} stat        The stat key
 * @param  {Number} sample_rate The sample rate (optional)
 * @param  {Array or Object} tags        The tags associated with the metric (optional)
 */
exports.decrement = function(stat, sample_rate, tags) {
    if (arguments.length === 2) {
        if (_.isArray(sample_rate) || _.isObject(sample_rate)) {
            tags = sample_rate;
            sample_rate = 1;
        }
    } else if (arguments.length === 1) {
        sample_rate = 1;
    }

    statsd.decrement(PREFIX + stat, sample_rate, convertTagsIfRequired(tags));
};

/**
 * Logs a gauge metric.
 * @param  {String} stat            The stat key
 * @param  {Number} value           The value
 * @param  {Number} sample_rate     The rate at which to sample this metric. 
 *                                  Defaults to 1 if omitted. Optional.
 * @param  {Array or Object} tags   Tags to tag the metric with. This can either 
 *                                  be an Array (e.g. ['foo', 'bar']) or an
 *                                  Object (e.g. {foo:'bar'}). Optional.
 */
exports.gauge = function(stat, value, sample_rate, tags) {
    if (arguments.length === 3) {
        if (_.isArray(sample_rate) || _.isObject(sample_rate)) {
            tags = sample_rate;
            sample_rate = 1;
        }
    } else if (arguments.length === 2) {
        sample_rate = 1;
    }

    statsd.gauge(PREFIX + stat, value, sample_rate, convertTagsIfRequired(tags));
};

/**
 * Logs a histogram metric.
 * @param  {String} stat            The stat key
 * @param  {Number} value           The value
 * @param  {Number} sample_rate     The rate at which to sample this metric. 
 *                                  Defaults to 1 if omitted. Optional.
 * @param  {Array or Object} tags   Tags to tag the metric with. This can either 
 *                                  be an Array (e.g. ['foo', 'bar']) or an
 *                                  Object (e.g. {foo:'bar'}). Optional.
 */
exports.histogram = function(stat, value, sample_rate, tags) {
    if (arguments.length === 3) {
        if (_.isArray(sample_rate) || _.isObject(sample_rate)) {
            tags = sample_rate;
            sample_rate = 1;
        }
    } else if (arguments.length === 2) {
        sample_rate = 1;
    }

    statsd.histogram(PREFIX + stat, value, sample_rate, convertTagsIfRequired(tags));
};

/**
 * Times the given function. In practice this method invokes the provided function, 
 * noting the time at which it was started. 
 * 
 * A callback function is provided to the given consumer function which should be 
 * invoked at the point the consumer function is considered "finished". At this 
 * point the time elapsed since the consumer was started will be logged as a timing
 * metric. A sample rate and tags can optionally provided to the callback.
 * @param  {Function} fn The function to be invoked and timed.
 */
exports.timed = function(fn) {
    var start = Date.now();
    fn(function(stat, sample_rate, tags) {
        if (arguments.length === 3) {
            exports.timing(stat, Date.now() - start, sample_rate, tags);
        } else if (arguments.length === 2) {
            exports.timing(stat, Date.now() - start, sample_rate);
        } else {
            exports.timing(stat, Date.now() - start);
        }
    });
};