import { assert } from 'chai';
import viva, { resolver, mapValuesAsync } from '../src/index';

function resolveIn(seconds) {
  return str => new Promise(
    resolve => setTimeout(resolve, seconds * 10, str),
  );
}

describe('viva.', () => {
  it('resolves an object', done => {

    const result = { viva: 'fight', la: 'the', resolution: 'power' };

    const myResolution = {
      viva() {
        return resolveIn(5)('fight');
      },
      la() {
        return resolveIn(1)('the');
      },
      resolution() {
        return resolveIn(2)('power');
      }
    };

    viva(myResolution).then(resolved => {
      assert.deepEqual(result, resolved);
      done();
    });
  });
  it('resolves an array', done => {

    const result = [ 'fight', 'the', 'power' ];

    const myResolution = [
      () => resolveIn(5)('fight'),
      () => resolveIn(1)('the'),
      () => resolveIn(2)('power'),
    ];

    viva(myResolution).then(resolved => {
      assert.deepEqual(result, resolved);
      done();
    });
  });
  it('resolves a mix', done => {

    const result = {
      viva: 'fight',
      la: 'the',
      resolution: 'power',
      arr: [ 'fight', 'the', 'power' ],
      again: {
        viva: 'fight',
        la: 'the',
        resolution: 'power',
      },
    };

    const myResolution = {
      viva: 'fight',
      la() {
        return resolveIn(1)('the');
      },
      resolution: Promise.resolve('power'),
      arr: [
        () => resolveIn(5)('fight'),
        () => resolveIn(1)('the'),
        () => resolveIn(2)('power'),
      ],
      again: {
        viva() {
          return resolveIn(5)('fight');
        },
        la() {
          return resolveIn(1)('the');
        },
        resolution() {
          return resolveIn(2)('power');
        }
      }
    };

    viva(myResolution).then(resolved => {
      assert.deepEqual(result, resolved);
      done();
    });
  });
  it('resolves with context', done => {

    const vivaLa = resolver({
      hello: 'world'
    });
    const result = [ 'world:fight', 'world:the', 'world:power' ];

    const myResolution = [
      ({ hello }) => resolveIn(5)(`${hello}:fight`),
      ({ hello }) => resolveIn(1)(`${hello}:the`),
      ({ hello }) => resolveIn(2)(`${hello}:power`),
    ];

    vivaLa(myResolution).then(resolved => {
      assert.deepEqual(result, resolved);
      done();
    });
  });
  it('gives proper path', done => {
    const vivaLa = resolver({});
    const myResolution = {
      viva: {
        la: {
          resolution(context, { path }) {
            assert.deepEqual(path, ['viva', 'la', 'resolution']);
            return true;
          }
        },
        laa: [
          (context, { path }) => {
            assert.deepEqual(path, ['viva', 'laa', 0]);
            return true;
          },
          (context, { path }) => {
            assert.deepEqual(path, ['viva', 'laa', 1]);
          }
        ],
      }
    };
    vivaLa(myResolution).then(resolved => {
      done();
    });
  });

  describe('configured resolver', () => {
    it('respects max depth', done => {
      const vivaLa = resolver({}, {
        maxDepth: 2,
      });
      const myResolution = {
        viva: {
          la: {
            resolution() {
              throw 'Depth not observed';
            }
          },
          laa() {
            return 1;
          }
        }
      };
      vivaLa(myResolution).then(resolved => {
        assert.equal(resolved.viva.laa, 1);
        done();
      });
    });
    /*
     maxDepth = -1,
     shouldResolve = DEFAULT_SHOULD_RESOLVE,
     onDidResolve = noop,
     onWillResolve = noop,
     */
    it('respects shouldResolve', done => {
      const vivaLa = resolver({}, {
        shouldResolve: (context, { path }) => path[path.length - 1] !== 'resolution',
      });
      const myResolution = {
        viva: {
          la: {
            resolution() {
              throw 'Should not resolve';
            }
          },
          laa() {
            return 1;
          }
        }
      };
      vivaLa(myResolution).then(resolved => {
        assert.equal(resolved.viva.laa, 1);
        done();
      });
    });

    it('respects onDidResolve', done => {
      const stack = [];
      const vivaLa = resolver({}, {
        onDidResolve: () => stack.push(1),
      });
      const myResolution = {
        viva: {
          la: {
            resolution() {
              assert.deepEqual(stack, []);
            }
          },
        }
      };
      vivaLa(myResolution).then(resolved => {
        assert.deepEqual(stack, [1]);
        done();
      });
    });

    it('respects onWillResolve', done => {
      const stack = [];
      const vivaLa = resolver({}, {
        onWillResolve: () => stack.push(1),
      });
      const myResolution = {
        viva: {
          la: {
            resolution() {
              assert.deepEqual(stack, [1]);
            }
          },
        }
      };
      vivaLa(myResolution).then(resolved => {
        assert.deepEqual(stack, [1]);
        done();
      });
    });

  });
  it('map values async works', done => {


    const params = { viva: 'fight', la: 'the', resolution: 'power' };
    const result = { viva: 'world:fight', la: 'world:the', resolution: 'world:power' };

    mapValuesAsync(params, val => resolveIn(1)(`world:${val}`)).then(resolved => {
      assert.deepEqual(result, resolved);
      done();
    });
  });
});
