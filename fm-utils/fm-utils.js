
exports.objectEntries  = function* (obj) {
  let propKeys = Reflect.ownKeys(obj);

  for (let propKey of propKeys) {
    yield [propKey, obj[propKey]];
  }
}

exports.mixins = function (...list) {
  return function (target) {
    Object.assign(target.prototype, ...list);
  };
}