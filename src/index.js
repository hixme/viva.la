export function mapValuesAsync(obj, map) {
  if (obj !== Object(obj)) {
    throw new Error(`${obj} is not an object`);
  }
  return Promise.all(
    Object.keys(obj)
      .map(key =>
        Promise.resolve(map(obj[key], key, obj))
          .then(value => ({
            value,
            key,
          }),
        )),
  ).then(kvps => kvps.reduce((memo, kvp) => ({
    ...memo,
    [kvp.key]: kvp.value,
  }), {}));
}

function isObject(item) {
  return (typeof item === 'object' && !Array.isArray(item) && item !== null);
}

const DEFAULT_NEXT_STATUS = ({ depth, path, ...status }, newPath) => ({
  ...status,
  depth: depth + 1,
  path: [...path, newPath],
});

const DEFAULT_SHOULD_RESOLVE = () => true;
const noop = () => {};

export function resolver(
  context,
  {
    nextStatus = DEFAULT_NEXT_STATUS,
    maxDepth = -1,
    shouldResolve = DEFAULT_SHOULD_RESOLVE,
    onDidResolve = noop,
    onWillResolve = noop,
  } = {},
) {
  const waitToResolve = () => Promise.resolve();
  const didResolve = (...args) => {
    onDidResolve(...args);
  };
  const willResolve = (...args) => {
    onWillResolve(...args);
  };
  return function resolve(model, status = { depth: 0, path: [] }) {
    if ((status.depth > maxDepth && maxDepth >= 0)) {
      didResolve(model, context, status);
      return Promise.resolve(model);
    }
    return waitToResolve(model, context, status).then(() => {
      if (model instanceof Function) {
        willResolve(model, context, status);
        if (!shouldResolve(context, status)) {
          didResolve(model, context, status);
          return Promise.resolve(model);
        }
        return resolve(model(context, status), status);
      }
      if (Array.isArray(model)) {
        return Promise
          .all(
            model.map(
              (item, index, arr) => resolve(item, nextStatus(status, index, arr)),
            ),
          );
      }
      if (model instanceof Promise) {
        return model.then(result => resolve(result, status));
      }
      if (!isObject(model)) {
        didResolve(model, context, status);
        return Promise.resolve(model);
      }
      return mapValuesAsync(
        model, (value, key, arr) => resolve(value, nextStatus(status, key, arr)),
      );
    });
  };
}

export default resolver();
