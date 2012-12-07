var dgram = require('dgram'),
    socket = dgram.createSocket('udp4'),
    _ = require('underscore'),
    config = require('gcconfig');

socket.bind();
config.dogstatsd = {
    port: socket.address().port,
    localhost: 'localhost'
};

var metrics = require('../lib/metrics');

describe('Metric logging', function() {

    afterEach(function() {
        socket.removeAllListeners('message');
    });

    after(function() {
        socket.close();
    });

    var shouldGetMessage = function(str, done) {
        socket.on('message', function(msg) {
            if (_.isRegExp(str)) {
                msg.toString().should.match(str);
            } else {
                msg.toString().should.eql(str);
            }
            done();
        });
    };

    it("should submit timing info", function(done) {
        shouldGetMessage('gcmetrics.something:50|ms|#test', done);
        metrics.timing('something', 50, 1, ['test']);
    });

    it("should increment", function(done) {
        shouldGetMessage('gcmetrics.something:1|c|#test', done);
        metrics.increment('something', 1, ['test']);
    });

    it("should decrement", function(done) {
        shouldGetMessage('gcmetrics.something:-1|c|#test', done);
        metrics.decrement('something', 1, ['test']);
    });

    it("should set a histogram", function(done) {
        shouldGetMessage('gcmetrics.something:5|h|#test', done);
        metrics.histogram('something', 5, 1, ['test']);
    });

    it("should set a gauge", function(done) {
        shouldGetMessage('gcmetrics.something:5|g|#test', done);
        metrics.gauge('something', 5, 1, ['test']);
    });

    it('should time callbacks', function(done) {
        shouldGetMessage(/gcmetrics\.something\:\d+\|ms\|#some,tags/, done);
        metrics.timed('something', function(cb) {
            setTimeout(cb, 10);
        }, ['some', 'tags']);
    });
});