const bcrypt = require('bcrypt');

let generateRandomString = () => {
  let a = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let output = [];
  for (let i = 0; i < 6; i++) {
    let randomindex = Math.floor(Math.random() * a.length);
    let randomvalue = a.charAt(randomindex);
    output.push(randomvalue);
  }
  return output.toString().replace(/,/g, '');
};

const checkEmail = function(email, users) {
  for (const id in users) {
    if (email === users[id].email) {
      return true;
    } //{error:"400  Missing Field", data:null}
  }
  return false;
};

const getUserByEmail = function(email, users) {
  for (const id in users) {
    if (email === users[id].email) {
      return users[id].id;
    }
  } return undefined;
};

const fetchUserById = function(id, userDatabase) {
  for (const userId in userDatabase) {
    if (userId === id) {
      return userDatabase[userId];
    }
  } return undefined;
};

const checkEmailAndPw = function(email, password, users) {
  for (const id in users) {
    if (bcrypt.compareSync(password, users[id].password) && email === users[id].email) {
      return { error: null, data: users[id] };
    }
  }
  return { error:"not found", data: null };
};

const urlsForUser = function(id, urls) {
  const cookieid = id;
  let data = {};
  for (let elems in urls) {
    if (cookieid === urls[elems].userID) {
      data[elems] = urls[elems];
    }
  }
  return { error: null,  data};
};


module.exports = { checkEmail, getUserByEmail, generateRandomString, fetchUserById, checkEmailAndPw, urlsForUser };