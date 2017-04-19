import viva from '../src';

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
