let generateRandomString = function() {
  let a = "0123456789abcdefghijklmnopqrstuvwxyz";
  let output = [];
  for (let i = 0; i < 6; i++) {
    let randomindex = Math.floor(Math.random() * 36) + 1;
    console.log(randomindex);
    let randomvalue = a.charAt(randomindex);
    output.push(randomvalue);
  }
  return output.toString().replace(/,/g, '');
};