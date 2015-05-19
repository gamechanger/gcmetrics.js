var _ = require('underscore'),
    StatsD = require('../lib/statsd'),
    config = require('@gamechanger/config');
    sinon = require('sinon');

config.dogstatsd = {
    port: 1234,
    localhost: 'localhost'
};

var real = StatsD.create();
var mockStatsD;


StatsD.create = function() {
    return real;
};

var metrics = require('../lib/metrics');

describe('Metric logging', function() {

    after(function() {
        delete require.cache[require.resolve('../lib/statsd')];
    });

    beforeEach(function() {
        mockStatsD = sinon.mock(real);
    });


    describe('timing', function() {
        it("should send timing info with sample rate and tags as array", function() {
            mockStatsD.expects('timing').once().withArgs('@gamechanger/metrics.something', 50, 0.5, ['test']);
            metrics.timing('something', 50, 0.5, ['test']);
            mockStatsD.verify();
        });

        it("should send timing info with tags as array", function() {
            mockStatsD.expects('timing').once().withArgs('@gamechanger/metrics.something', 50, 1, ['test']);
            metrics.timing('something', 50, ['test']);
            mockStatsD.verify();
        });

        it("should send timing info with sample rate and tags as object", function() {
            mockStatsD.expects('timing').once().withArgs('@gamechanger/metrics.something', 50, 0.5, ['foo:bar']);
            metrics.timing('something', 50, 0.5, {foo: 'bar'});
            mockStatsD.verify();
        });

        it("should send timing info with tags as object", function() {
            mockStatsD.expects('timing').once().withArgs('@gamechanger/metrics.something', 50, 1, ['foo:bar']);
            metrics.timing('something', 50, {foo: 'bar'});
            mockStatsD.verify();
        });
    });

    describe('increment', function() {
        it("should increment with a sample rate and tag array", function() {
            mockStatsD.expects('increment').withArgs('@gamechanger/metrics.something', 0.5, ['test']);
            metrics.increment('something', 0.5, ['test']);
            mockStatsD.verify();
        });
        it("should increment with tag array", function() {
            mockStatsD.expects('increment').withArgs('@gamechanger/metrics.something', 1, ['test']);
            metrics.increment('something', ['test']);
            mockStatsD.verify();
        });
        it("should increment with a sample rate and tag object", function() {
            mockStatsD.expects('increment').withArgs('@gamechanger/metrics.something', 0.5, ['foo:bar']);
            metrics.increment('something', 0.5, {foo: 'bar'});
            mockStatsD.verify();
        });
        it("should increment with a sample rate and tag array", function() {
            mockStatsD.expects('increment').withArgs('@gamechanger/metrics.something', 1, ['foo:bar']);
            metrics.increment('something', {foo: 'bar'});
            mockStatsD.verify();
        });
    });

    describe('decrement', function() {
        it("should decrement with a sample rate and tag array", function() {
            mockStatsD.expects('decrement').withArgs('@gamechanger/metrics.something', 0.5, ['test']);
            metrics.decrement('something', 0.5, ['test']);
            mockStatsD.verify();
        });
        it("should decrement with tag array", function() {
            mockStatsD.expects('decrement').withArgs('@gamechanger/metrics.something', 1, ['test']);
            metrics.decrement('something', ['test']);
            mockStatsD.verify();
        });
        it("should decrement with a sample rate and tag object", function() {
            mockStatsD.expects('decrement').withArgs('@gamechanger/metrics.something', 0.5, ['foo:bar']);
            metrics.decrement('something', 0.5, {foo: 'bar'});
            mockStatsD.verify();
        });
        it("should decrement with a sample rate and tag array", function() {
            mockStatsD.expects('decrement').withArgs('@gamechanger/metrics.something', 1, ['foo:bar']);
            metrics.decrement('something', {foo: 'bar'});
            mockStatsD.verify();
        });
    });

    describe('gauge', function() {
        it("should send gauge info with sample rate and tags as array", function() {
            mockStatsD.expects('gauge').once().withArgs('@gamechanger/metrics.something', 50, 0.5, ['test']);
            metrics.gauge('something', 50, 0.5, ['test']);
            mockStatsD.verify();
        });

        it("should send gauge info with tags as array", function() {
            mockStatsD.expects('gauge').once().withArgs('@gamechanger/metrics.something', 50, 1, ['test']);
            metrics.gauge('something', 50, ['test']);
            mockStatsD.verify();
        });

        it("should send gauge info with sample rate and tags as object", function() {
            mockStatsD.expects('gauge').once().withArgs('@gamechanger/metrics.something', 50, 0.5, ['foo:bar']);
            metrics.gauge('something', 50, 0.5, {foo: 'bar'});
            mockStatsD.verify();
        });

        it("should send gauge info with tags as object", function() {
            mockStatsD.expects('gauge').once().withArgs('@gamechanger/metrics.something', 50, 1, ['foo:bar']);
            metrics.gauge('something', 50, {foo: 'bar'});
            mockStatsD.verify();
        });
    });

    describe('histogram', function() {
        it("should send histogram info with sample rate and tags as array", function() {
            mockStatsD.expects('histogram').once().withArgs('@gamechanger/metrics.something', 50, 0.5, ['test']);
            metrics.histogram('something', 50, 0.5, ['test']);
            mockStatsD.verify();
        });

        it("should send histogram info with tags as array", function() {
            mockStatsD.expects('histogram').once().withArgs('@gamechanger/metrics.something', 50, 1, ['test']);
            metrics.histogram('something', 50, ['test']);
            mockStatsD.verify();
        });

        it("should send histogram info with sample rate and tags as object", function() {
            mockStatsD.expects('histogram').once().withArgs('@gamechanger/metrics.something', 50, 0.5, ['foo:bar']);
            metrics.histogram('something', 50, 0.5, {foo: 'bar'});
            mockStatsD.verify();
        });

        it("should send histogram info with tags as object", function() {
            mockStatsD.expects('histogram').once().withArgs('@gamechanger/metrics.something', 50, 1, ['foo:bar']);
            metrics.histogram('something', 50, {foo: 'bar'});
            mockStatsD.verify();
        });
    });

    describe('timed callback', function() {
        it('should time callbacks with sample rate and tag array', function(done) {
            mockStatsD.expects('timing').once().withArgs('@gamechanger/metrics.something', sinon.match.number, 0.5, ['test']);
            metrics.timed(function(cb) {
                setTimeout(function() {
                    cb('something', 0.5, ['test']);
                    mockStatsD.verify();
                    done();
                }, 10);
            });
        });

        it('should time callbacks with tag array', function(done) {
            mockStatsD.expects('timing').once().withArgs('@gamechanger/metrics.something', sinon.match.number, 1, ['test']);
            metrics.timed(function(cb) {
                setTimeout(function() {
                    cb('something', ['test']);
                    mockStatsD.verify();
                    done();
                }, 10);
            });
        });

        it('should time callbacks with sample rate and tag object', function(done) {
            mockStatsD.expects('timing').once().withArgs('@gamechanger/metrics.something', sinon.match.number, 0.5, ['foo:bar']);
            metrics.timed(function(cb) {
                setTimeout(function() {
                    cb('something', 0.5, {foo:'bar'});
                    mockStatsD.verify();
                    done();
                }, 10);
            });
        });

        it('should time callbacks with tag object', function(done) {
            mockStatsD.expects('timing').once().withArgs('@gamechanger/metrics.something', sinon.match.number, 1, ['foo:bar']);
            metrics.timed(function(cb) {
                setTimeout(function() {
                    cb('something', {foo:'bar'});
                    mockStatsD.verify();
                    done();
                }, 10);
            });
        });
    });

});
