# viva.la [![Build Status](https://travis-ci.org/hixme/viva.la.svg?branch=master)](https://travis-ci.org/hixme/viva.la)
Revolutionary Async Resolution. :v:

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
const vivaLa = resolver(() => console.log('hi'));

const myResolution = {
  viva(sayHi) {
    sayHi();
    return 'fight';
  },
  la(sayHi) {
    sayHi();
    return 'the';
  },
  resolution(sayHi) {
    sayHi();
    return 'power';
  }
};
vivaLa(myResolution);

// hi
// hi
// hi
```

## License

MIT
