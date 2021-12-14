/*
    General purpose metrics logging module. This module takes care of
    setting up the appropriate metrics logging client (currently
    dogstatsd), allowing tag and path contexts to be added/removed
    via a consistent API which can be consumed by the rest of the app.
 */

const StatsD = require('node-dogstatsd').StatsD;
const _ = require('underscore');
require('underscore.string');

let statsd;
let PREFIX = require(process.cwd() + '/package').name + '.';

/**
 * Register a global statsd instance for use by the stat emitters
 * in this library.
 *
 * @param {String} host of the DogStatsD instance
 * @param {Number} port of the DogStatsD instance
 * @param {String} prefix optional prefix to use for all metrics
 * @return {StatsD} created StatsD instance
 */
exports.registerDogStatsD = function(host, port, prefix) {
  statsd = new StatsD(host, port);
  PREFIX = prefix === undefined ? PREFIX : prefix;
  if (!PREFIX.endsWith('.')) {
    PREFIX = `${PREFIX}.`;
  }
  return statsd;
};

/**
 * Converts tag "objects" to arrays if necessary.
 *
 * e.g. {foo: "bar"} -> ['foo:bar']
 * @param  {Object|Array} tags the Object or Array
 * @return {Array}      The original array or converted object.
 */
const convertTagsIfRequired = function(tags) {
  if (!_.isArray(tags)) {
    return _.map(tags, function(value, key) {
      return key + ':' + value;
    });
  }
  return tags;
};

/**
 * Logs a timing metric.
 * @param  {String} stat            The stat key
 * @param  {Number} time            The timing value in ms
 * @param  {Number} sampleRate     The rate at which to sample this metric.
 *                                  Defaults to 1 if omitted. Optional.
 * @param  {Array|Object} tags   Tags to tag the metric with. This can either
 *                                  be an Array (e.g. ['foo', 'bar']) or an
 *                                  Object (e.g. {foo:'bar'}). Optional.
 */
exports.timing = function(stat, time, sampleRate, tags) {
  if (arguments.length === 3) {
    if (_.isArray(sampleRate) || _.isObject(sampleRate)) {
      tags = sampleRate;
      sampleRate = 1;
    }
  } else if (arguments.length === 2) {
    sampleRate = 1;
  }

  statsd.timing(PREFIX + stat, time, sampleRate, convertTagsIfRequired(tags));
};


/**
 * increments a stat count
 * @param  {String} stat        The stat key
 * @param  {Number} sampleRate The sample rate (optional)
 * @param  {Array|Object} tags The tags associated with the metric (optional)
 */
exports.increment = function(stat, sampleRate, tags) {
  if (arguments.length === 2) {
    if (_.isArray(sampleRate) || _.isObject(sampleRate)) {
      tags = sampleRate;
      sampleRate = 1;
    }
  } else if (arguments.length === 1) {
    sampleRate = 1;
  }

  statsd.increment(PREFIX + stat, sampleRate, convertTagsIfRequired(tags));
};

/**
 * decrements a stat count
 * @param  {String} stat        The stat key
 * @param  {Number} sampleRate  The sample rate (optional)
 * @param  {Array|Object} tags  The tags associated with the metric (optional)
 */
exports.decrement = function(stat, sampleRate, tags) {
  if (arguments.length === 2) {
    if (_.isArray(sampleRate) || _.isObject(sampleRate)) {
      tags = sampleRate;
      sampleRate = 1;
    }
  } else if (arguments.length === 1) {
    sampleRate = 1;
  }

  statsd.decrement(PREFIX + stat, sampleRate, convertTagsIfRequired(tags));
};

/**
 * Logs a gauge metric.
 * @param  {String} stat            The stat key
 * @param  {Number} value           The value
 * @param  {Number} sampleRate     The rate at which to sample this metric.
 *                                  Defaults to 1 if omitted. Optional.
 * @param  {Array|Object} tags   Tags to tag the metric with. This can either
 *                                  be an Array (e.g. ['foo', 'bar']) or an
 *                                  Object (e.g. {foo:'bar'}). Optional.
 */
exports.gauge = function(stat, value, sampleRate, tags) {
  if (arguments.length === 3) {
    if (_.isArray(sampleRate) || _.isObject(sampleRate)) {
      tags = sampleRate;
      sampleRate = 1;
    }
  } else if (arguments.length === 2) {
    sampleRate = 1;
  }

  statsd.gauge(PREFIX + stat, value, sampleRate, convertTagsIfRequired(tags));
};

/**
 * Logs a histogram metric.
 * @param  {String} stat            The stat key
 * @param  {Number} value           The value
 * @param  {Number} sampleRate     The rate at which to sample this metric.
 *                                  Defaults to 1 if omitted. Optional.
 * @param  {Array|Object} tags    Tags to tag the metric with. This can either
 *                                  be an Array (e.g. ['foo', 'bar']) or an
 *                                  Object (e.g. {foo:'bar'}). Optional.
 */
exports.histogram = function(stat, value, sampleRate, tags) {
  if (arguments.length === 3) {
    if (_.isArray(sampleRate) || _.isObject(sampleRate)) {
      tags = sampleRate;
      sampleRate = 1;
    }
  } else if (arguments.length === 2) {
    sampleRate = 1;
  }

  statsd.histogram(
      PREFIX + stat,
      value,
      sampleRate,
      convertTagsIfRequired(tags),
  );
};

/**
 * Times the given function. In practice this method invokes the provided
 * function, noting the time at which it was started.
 *
 * A callback function is provided to the given consumer function which should
 * be invoked at the point the consumer function is considered "finished". At
 * this point the time elapsed since the consumer was started will be logged
 * as a timing metric. A sample rate and tags can optionally provided to the
 * callback.
 *
 * @param  {Function} fn The function to be invoked and timed.
 */
exports.timed = function(fn) {
  const start = Date.now();
  fn(function(stat, sampleRate, tags) {
    if (arguments.length === 3) {
      exports.timing(stat, Date.now() - start, sampleRate, tags);
    } else if (arguments.length === 2) {
      exports.timing(stat, Date.now() - start, sampleRate);
    } else {
      exports.timing(stat, Date.now() - start);
    }
  });
};
