import { resolver } from '../src';

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
