var obj = {
  x: 10,
  fn: function () {
    function f() {
      console.log(this);
      console.log(this.x);
    }
    return f;
  }
}

obj.fn().call(obj);
obj.fn().apply(obj);
obj.fn().call();
