const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "jhdiue": "http://www.test.com"
};

let myObjects = Object.entries(urlDatabase)
let myNewArrayfunct = function(obj){
  let myNewArray = [];
  for (i = 0; i < myObjects.length; i++){
    if ((!myObjects[i].includes('b2xVn2') === true)){
      myNewArray.push(myObjects[i][0])
      myNewArray.push(myObjects[i][1])
    }
  }return myNewArray
}



let myNewObjectfunct = function(myNewArray) {
  let myNewObject = {};
  for (i = 0; i < myNewArray.length; i = i++){
    myNewObject[myNewArray[i]] = myNewObject[myNewArray[i+1]]
  }return myNewObject
};


console.log(myNewObjectfunct(myNewArrayfunct(urlDatabase)));
