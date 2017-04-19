# viva.la [![Build Status](https://travis-ci.org/hixme/viva.la.svg?branch=master)](https://travis-ci.org/hixme/viva.la)
Radical Async Resolution. :v:

No nonsense object resolver.
 
*Viva la Resolution!*

# Install

`npm i viva.la --save`

# Usage

Viva.la generates a function that will crawl an object and resolve any function values or promises into an object with identical keys. 

## Resolution

```js
import viva from 'viva.la';

function resolveIn(seconds) {
  return str => new Promise(
    resolve => setTimeout(resolve, seconds * 1000, str),
  );
}

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

viva(myResolution).then(console.log);
// 5 seconds later:
// prints {viva: 'fight', la: 'the', resolution: 'power'}

```

## Context

Using the `resolver` top level composer, you can set a context that all methods have access to.

```js
import { resolver } from 'viva.la';

const vivaLa = resolver({count: 1});

function resolveIn(seconds) {
  return str => new Promise(
    resolve => setTimeout(resolve, seconds * 1000, str),
  );
}

const myResolution = {
  viva(context) {
    console.log(context.count ++);
    return resolveIn(5)('fight');
  },
  la(context) {
    console.log(context.count ++);
    return resolveIn(1)('the');
  },
  resolution(context) {
    console.log(context.count ++);
    return resolveIn(2)('power');
  }
};

vivaLa(myResolution)
  .then(console.log);
// 1
// 2
// 3
// then 5 seconds later:
// prints {viva: 'fight', la: 'the', resolution: 'power'}
```

You can pass anything as context here.

```js
const vivaLa = resolver(() => console.log('Groovy'));

const myResolution = {
  viva(sayGroovy) {
    sayGroovy();
    return 'fight';
  },
  la(sayGroovy) {
    sayGroovy();
    return 'the';
  },
  resolution(sayGroovy) {
    sayGroovy();
    return 'power';
  }
};
vivaLa(myResolution);

// Groovy
// Groovy
// Groovy
```

The default resolver implementation uses an empty object for context.

## Method Arguments

Methods are called with the arguments `context, {path, depth}`.

```js
import viva from 'viva.la';

const myResolution = {
  viva: {
    la: {
      resolution(context, {path, depth}) {
        console.log('Depth', depth);
        console.log('Path', path);
        return true;
      }
    }
  }
};

viva(myResolution)
  .then(console.log);
// Depth 3
// Path [ 'viva', 'la', 'resolution' ]
// { viva: { la: { resolution: true } } }
```

## Lifecycle

TODO

### shouldResolve

TODO
    
### onDidResolve
    
TODO
    
### onWillResolve

TODO

## License

MIT
