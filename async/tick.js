
  let count = 1;
  function tick(time) {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('tick %s after %s ms', count++, time);
        resolve();
      }, time);
    });
  }
  async function main() {
    console.log('start run...');
    await tick(5000);
    await tick(1000);
    await tick(6000);
  }
  main();
