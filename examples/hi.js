import { resolver } from '../src';

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
