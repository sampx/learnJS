{
  const obj = {
    [Symbol.iterator] : function () {
      let i = 1;
      return {
        next: function () {
          return {
            value: i,
            done: i++ <= 3 ? false : true
          };
        }
      };
    }
  };

  let it = obj[Symbol.iterator]();
  console.log(it.next());
  console.log(it.next());
  console.log(it.next());

  console.log(...obj);
}

{
  class RangeIterator {
    constructor(start, stop) {
      this.value = start;
      this.stop = stop;
    }

    [Symbol.iterator]() { return this; }

    next() {
      let value = this.value;
      if (value < this.stop) {
        this.value++;
        return {value: value};
      }
      return {done: true};
    }
  }

  function range(start, stop) {
    return new RangeIterator(start, stop);
  }

  // for (let value of range(0, 3)) {
    console.log(...range(6, 10));
  // }
}

{
  let iterable = {
    0: 'a',
    1: 'b',
    2: 'c',
    length: 3,
    [Symbol.iterator]: [][Symbol.iterator]
  };
  for (let item of iterable) {
    console.log(item); // 'a', 'b', 'c'
  }
}

{
  let generator = function* () {
    yield 1;
    yield* [7,3,4];
    yield 5;
  };

  var iterator = generator();

  console.log(iterator.next()) // { value: 1, done: false }
  console.log(iterator.next()) // { value: 2, done: false }
  console.log(iterator.next()) // { value: 3, done: false }
  console.log(iterator.next()) // { value: 4, done: false }
  console.log(iterator.next()) // { value: 5, done: false }
  console.log(iterator.next()) // { value: undefined, done: true }
}