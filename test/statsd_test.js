var StatsD = require('../lib/statsd'),
    config = require('gcconfig');

config.dogstatsd = {
    port: 1234,
    localhost: 'localhost'
};

describe("Statsd loader", function() {
    it("should create a StatsD instance pointing at the right host/port", function() {
        var instance = StatsD.create();
        instance.host.should.eql('localhost');
        instance.port.should.eql(1234);
    });
    
});