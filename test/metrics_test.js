const metrics = require('../lib/metrics');
const sinon = require('sinon');

const realStatsD = metrics.registerDogStatsD(
    'localhost',
    1234,
    'customPrefix.',
);

describe('Metric logging', () => {
  let mockStatsD;

  beforeEach(() => {
    mockStatsD = sinon.mock(realStatsD);
  });

  describe('timing', () => {
    it('should send timing info with sample rate and tags as array', () => {
      mockStatsD.expects('timing').once()
          .withArgs('customPrefix.something', 50, 0.5, ['test']);
      metrics.timing('something', 50, 0.5, ['test']);
      mockStatsD.verify();
    });

    it('should send timing info with tags as array', () => {
      mockStatsD.expects('timing').once()
          .withArgs('customPrefix.something', 50, 1, ['test']);
      metrics.timing('something', 50, ['test']);
      mockStatsD.verify();
    });

    it('should send timing info with sample rate and tags as object', () => {
      mockStatsD.expects('timing').once()
          .withArgs('customPrefix.something', 50, 0.5, ['foo:bar']);
      metrics.timing('something', 50, 0.5, {foo: 'bar'});
      mockStatsD.verify();
    });

    it('should send timing info with tags as object', () => {
      mockStatsD.expects('timing').once()
          .withArgs('customPrefix.something', 50, 1, ['foo:bar']);
      metrics.timing('something', 50, {foo: 'bar'});
      mockStatsD.verify();
    });
  });

  describe('increment', () => {
    it('should increment with a sample rate and tag array', () => {
      mockStatsD.expects('increment')
          .withArgs('customPrefix.something', 0.5, ['test']);
      metrics.increment('something', 0.5, ['test']);
      mockStatsD.verify();
    });
    it('should increment with tag array', () => {
      mockStatsD.expects('increment')
          .withArgs('customPrefix.something', 1, ['test']);
      metrics.increment('something', ['test']);
      mockStatsD.verify();
    });
    it('should increment with a sample rate and tag object', () => {
      mockStatsD.expects('increment')
          .withArgs('customPrefix.something', 0.5, ['foo:bar']);
      metrics.increment('something', 0.5, {foo: 'bar'});
      mockStatsD.verify();
    });
    it('should increment with a sample rate and tag array', () => {
      mockStatsD.expects('increment')
          .withArgs('customPrefix.something', 1, ['foo:bar']);
      metrics.increment('something', {foo: 'bar'});
      mockStatsD.verify();
    });
  });

  describe('incrementBy', () => {
    it('should increment with a value and tag array', () => {
      mockStatsD.expects('incrementBy')
          .withArgs('customPrefix.something', 10, ['test']);
      metrics.incrementBy('something', 10, ['test']);
      mockStatsD.verify();
    });
    it('should increment with tag array', () => {
      mockStatsD.expects('incrementBy')
          .withArgs('customPrefix.something', 1, ['test']);
      metrics.incrementBy('something', ['test']);
      mockStatsD.verify();
    });
    it('should increment with a value and tag object', () => {
      mockStatsD.expects('incrementBy')
          .withArgs('customPrefix.something', 5, ['foo:bar']);
      metrics.incrementBy('something', 5, {foo: 'bar'});
      mockStatsD.verify();
    });
    it('should increment with tag array', () => {
      mockStatsD.expects('incrementBy')
          .withArgs('customPrefix.something', 1, ['foo:bar']);
      metrics.incrementBy('something', {foo: 'bar'});
      mockStatsD.verify();
    });
  });

  describe('decrement', () => {
    it('should decrement with a sample rate and tag array', () => {
      mockStatsD.expects('decrement')
          .withArgs('customPrefix.something', 0.5, ['test']);
      metrics.decrement('something', 0.5, ['test']);
      mockStatsD.verify();
    });
    it('should decrement with tag array', () => {
      mockStatsD.expects('decrement')
          .withArgs('customPrefix.something', 1, ['test']);
      metrics.decrement('something', ['test']);
      mockStatsD.verify();
    });
    it('should decrement with a sample rate and tag object', () => {
      mockStatsD.expects('decrement')
          .withArgs('customPrefix.something', 0.5, ['foo:bar']);
      metrics.decrement('something', 0.5, {foo: 'bar'});
      mockStatsD.verify();
    });
    it('should decrement with a sample rate and tag array', () => {
      mockStatsD.expects('decrement')
          .withArgs('customPrefix.something', 1, ['foo:bar']);
      metrics.decrement('something', {foo: 'bar'});
      mockStatsD.verify();
    });
  });

  describe('decrementBy', () => {
    it('should decrement with a value and tag array', () => {
      mockStatsD.expects('decrementBy')
          .withArgs('customPrefix.something', 10, ['test']);
      metrics.decrementBy('something', 10, ['test']);
      mockStatsD.verify();
    });
    it('should decrement with tag array', () => {
      mockStatsD.expects('decrementBy')
          .withArgs('customPrefix.something', 1, ['test']);
      metrics.decrementBy('something', ['test']);
      mockStatsD.verify();
    });
    it('should decrement with a value and tag object', () => {
      mockStatsD.expects('decrementBy')
          .withArgs('customPrefix.something', 5, ['foo:bar']);
      metrics.decrementBy('something', 5, {foo: 'bar'});
      mockStatsD.verify();
    });
    it('should decrement with tag array', () => {
      mockStatsD.expects('decrementBy')
          .withArgs('customPrefix.something', 1, ['foo:bar']);
      metrics.decrementBy('something', {foo: 'bar'});
      mockStatsD.verify();
    });
  });

  describe('gauge', () => {
    it('should send gauge info with sample rate and tags as array', () => {
      mockStatsD.expects('gauge').once()
          .withArgs('customPrefix.something', 50, 0.5, ['test']);
      metrics.gauge('something', 50, 0.5, ['test']);
      mockStatsD.verify();
    });

    it('should send gauge info with tags as array', () => {
      mockStatsD.expects('gauge').once()
          .withArgs('customPrefix.something', 50, 1, ['test']);
      metrics.gauge('something', 50, ['test']);
      mockStatsD.verify();
    });

    it('should send gauge info with sample rate and tags as object', () => {
      mockStatsD.expects('gauge').once()
          .withArgs('customPrefix.something', 50, 0.5, ['foo:bar']);
      metrics.gauge('something', 50, 0.5, {foo: 'bar'});
      mockStatsD.verify();
    });

    it('should send gauge info with tags as object', () => {
      mockStatsD.expects('gauge').once()
          .withArgs('customPrefix.something', 50, 1, ['foo:bar']);
      metrics.gauge('something', 50, {foo: 'bar'});
      mockStatsD.verify();
    });
  });

  describe('histogram', () => {
    it('should send histogram info with sample rate and tags as array', () => {
      mockStatsD.expects('histogram').once()
          .withArgs('customPrefix.something', 50, 0.5, ['test']);
      metrics.histogram('something', 50, 0.5, ['test']);
      mockStatsD.verify();
    });

    it('should send histogram info with tags as array', () => {
      mockStatsD.expects('histogram').once()
          .withArgs('customPrefix.something', 50, 1, ['test']);
      metrics.histogram('something', 50, ['test']);
      mockStatsD.verify();
    });

    it('should send histogram info with sample rate and tags as object', () => {
      mockStatsD.expects('histogram').once()
          .withArgs('customPrefix.something', 50, 0.5, ['foo:bar']);
      metrics.histogram('something', 50, 0.5, {foo: 'bar'});
      mockStatsD.verify();
    });

    it('should send histogram info with tags as object', () => {
      mockStatsD.expects('histogram').once()
          .withArgs('customPrefix.something', 50, 1, ['foo:bar']);
      metrics.histogram('something', 50, {foo: 'bar'});
      mockStatsD.verify();
    });
  });

  describe('timed callback', () => {
    it('should time callbacks with sample rate and tag array', (done) => {
      mockStatsD.expects('timing').once()
          .withArgs(
              'customPrefix.something',
              sinon.match.number,
              0.5, ['test'],
          );
      metrics.timed((cb) => {
        setTimeout(() => {
          cb('something', 0.5, ['test']);
          mockStatsD.verify();
          done();
        }, 10);
      });
    });

    it('should time callbacks with tag array', (done) => {
      mockStatsD.expects('timing').once()
          .withArgs(
              'customPrefix.something',
              sinon.match.number,
              1,
              ['test'],
          );
      metrics.timed((cb) => {
        setTimeout(() => {
          cb('something', ['test']);
          mockStatsD.verify();
          done();
        }, 10);
      });
    });

    it('should time callbacks with sample rate and tag object', (done) => {
      mockStatsD.expects('timing').once()
          .withArgs(
              'customPrefix.something',
              sinon.match.number,
              0.5,
              ['foo:bar'],
          );
      metrics.timed((cb) => {
        setTimeout(() => {
          cb('something', 0.5, {foo: 'bar'});
          mockStatsD.verify();
          done();
        }, 10);
      });
    });

    it('should time callbacks with tag object', (done) => {
      mockStatsD.expects('timing').once()
          .withArgs(
              'customPrefix.something',
              sinon.match.number,
              1,
              ['foo:bar'],
          );
      metrics.timed((cb) => {
        setTimeout(() => {
          cb('something', {foo: 'bar'});
          mockStatsD.verify();
          done();
        }, 10);
      });
    });
  });
});
