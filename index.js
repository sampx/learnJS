
let arr = [7,3,6,4];

// (function next(i, len, callback) {
//   if (i < len) {
//     asyncDo(arr[i], function (value) {
//       arr[i] = value;
//       next(i + 1, len, callback);
//     });
//   } else {
//     callback();
//   }
// }(0, arr.length, function () {
//   console.log(arr);
//   console.log('All array items have processed.');
// }))

async function addEach(arr){
  for(let i=0;i < arr.length;i++){
    let res = await asyncDo(arr[i]);
    arr[i] = res;
  }
  console.log(arr);
  console.log('All array items have processed.');
}

function asyncDo(v=0){
  console.log('processing:'+ v);
  return new Promise((resolve) => {
    setTimeout(resolve,1000,v * v);
  });
}

addEach(arr);

