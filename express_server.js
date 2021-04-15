const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(cookieParser());

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  },
  "asd":{
    id: "asd", 
    email: "2@3.com", 
    password: "1234"
  }
}


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

const fetchUserById = function (id, userDatabase){
  for (let userId in userDatabase){
    if (userId === id){
      return userDatabase[userId]
    }
  }return undefined;
}

const userCreate = function(email){
  if (!email){
// const userCreate = function(email, password){
  //if (!email || !password){
    return false;
    //{error:"400  Missing Field", data:null}
  } return true;
};
 
const checkEmail = function (email, users) {
  for (let id in users){
   if (email === users[id].email){
     console.log(email)
     return true
   } //{error:"400  Missing Field", data:null}
  }
  return false
}

const checkEmailAndPw = function (email, password, users) {
  console.log(users)
  for (let id in users) {
    if (bcrypt.compareSync(password, users[id].password) && email === users[id].email) {
      // console.log("HERE", password, users[id].password)
      // console.log("HERE", password, users[id].password)
      // console.log("HERE", email, users[id].password)
    //if (password === users[id].password && email === users[id].email) {
      return { error: null, data: users[id] }
    }
    console.log(password, users[id].password)
    console.log(email, users[id].email)
  }
  return { error:"not found", data: null } 
}

const urlsForUser = function(id){
  const cookieid = id
  let data ={};
    for (let elems in urlDatabase){
      // console.log("shortURL-->", elems)
      // console.log("UserID-->", urlDatabase[elems].userID)
      // console.log("LongURL-->", urlDatabase[elems].longURL)
      if (cookieid === urlDatabase[elems].userID){
          //console.log("UserID-->", urlDatabase[elems].userID)
          data[elems] = urlDatabase[elems];
      } 
      
    } 
    
    return { error: null,  data}
  };


app.get("/urls", (req,res) => {
  //console.log(req.cookies['user_id']);
  if (req.cookies['user_id']) {
  //console.log("req", req.cookies);
    let id = req.cookies['user_id']
    //console.log(id)
    const result = urlsForUser(id)
    // console.log("WHYYYYYYY", result)
    // console.log(urlDatabase)
    // console.log(users)
    // if (result.error){
    //   res.redirect('/login');
    // } else {
    const user = fetchUserById(id, users) 
    const templateVars = { user: user || "", urls: result.data };
    //const templateVars = { username: req.cookies["username"] || "", urls: urlDatabase };
    res.render('urls_index', templateVars);
  
  //Linking object to */urls_index.js
  } else {
    res.redirect('/login');
  }
});

app.get("/urls/new", (req,res) => {
  if (req.cookies['user_id']){
  //const templateVars = { user: req.cookies.id || ""};
  let id = req.cookies['user_id']
  const user = fetchUserById(id, users)
  const templateVars = { user: user || ""};
  res.render("urls_new", templateVars);
  } else{
    res.redirect('/login');
  }
});


app.post("/logout", (req, res) => {
  //console.log(req.params);
  //res.cookie('username', req.body.username)
  //'user_id', result.data.id
  // let id = req.cookies['user_id']
  // const user = fetchUserById(id, users);
  //console.log(req.body)
  res.clearCookie('user_id');

  //res.clearCookie('username', req.body.username)
  res.redirect('/urls');
});

app.get("/login", (req, res) => {
  console.log(req.params);
  let id = req.cookies['user_id']
  const user = fetchUserById(id, users)
  const templateVars = { user: user || ""};
  //const templateVars = { username: req.cookies["username"] || ""};
  //res.cookie('username', req.body.username)
  //res.clearCookie('username', req.body.username)
  res.render("urls_login", templateVars);
});

app.get("/register", (req, res) => {
  console.log(req.params);
  let id = req.cookies['user_id']
  const user = fetchUserById(id, users)
  const templateVars = { user: user || ""};
  //const templateVars = { username: req.cookies["username"] || ""};
  //res.cookie('username', req.body.username)
  //res.clearCookie('username', req.body.username)
  res.render("urls_register", templateVars);
});

app.post("/login", (req, res) => {
  // let id = generateRandomString();
  let email = req.body.email
  //let password  = req.body.password
  let password  = req.body.password
  // //let newUser = {id};
  console.log("login", email, password, users);
  // if (!(userCreate(email, password))) {
  //   res.send (400, "missing field")
  //if (checkEmailAndPw(email, password, users)){
  //    res.send(403, "Email or Password not found")
  const result = checkEmailAndPw(email, password, users)
    if (result.error){
      return res.send(403, "Email or Password not found");
    }
  
  let id = result.data.id;
  res.cookie('user_id', result.data.id)
    

//} else {
  // //console.log(id, req.body.email, req.body.password)
  // console.log(id, email, password);
  // //console.log(newUser);
  // users[id] = {id, email, password}
  // console.log(users)
  // res.cookie('user_id', id)
  // console.log(users[id])
  //res.cookie('user_id', result.users[id].id)
  res.redirect('/urls');
  
});

app.post("/register", (req, res) => {
  let id = generateRandomString();
  let email = req.body.email
  let password  = bcrypt.hashSync(req.body.password, 10)
  //let password  = req.body.password
  //let newUser = {id};
  //console.log(email, password);
  if (!(userCreate(email))) {
    res.send (400, "missing field")
  } else if (checkEmail(email, users)){
    res.send (400, "email exist!!")
  } else {
  //console.log(id, req.body.email, req.body.password)
  //console.log(id, email, password);
  //console.log(newUser);
  users[id] = {id, email, password}
  //console.log(users)
  res.cookie('user_id', id)
  //console.log(users[id])
  res.redirect('/urls');
  }
});

app.post("/urls", (req, res) => {
  //console.log(req.params);
  if (req.body) {
    let small = generateRandomString();
    let userid = req.cookies['user_id']
    //console.log("cookie Monster", userid, req.cookie)
    //urlDatabase[small] = ('http://') + req.body.longURL;
    urlDatabase[small]  = {longURL: ('http://') + req.body.longURL, userID: userid};
    //console.log(urlDatabase)
    res.redirect('/urls/' + small);
    //urlDatabase[req.params.shortURL].longURL
  }
});

app.post("/urls/:shortURL", (req, res) => {
  //console.log("XXFSH", req.params, req.body);
  //console.log(urlDatabase)
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect('/urls');
    // let small = generateRandomString();
    // urlDatabase[small] = ('http://') + req.body.longURL;
    // res.redirect(302, '/urls/' + small);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  // console.log(req.params)
  // console.log([req.params.shortURL])
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');

});

app.post("/urls/:shortURL/edit", (req, res) => {
  //console.log("XXFSH", req.params, req.body);
  //console.log("EDIT", urlDatabase)
  //console.log("EDIT", [req.params.shortURL].longURL)
  // console.log([req.params.shortURL])
  //res.redirect(`/urls/` + req.params.shortURL);

});

app.get("/u/:shortURL", (req, res) => {
  if (req.body) {
    res.redirect(urlDatabase[req.params.shortURL].longURL);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  //const templateVars = { user: req.cookies.id || "", shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  let id = req.cookies['user_id']
  const user = fetchUserById(id, users)
  //const templateVars = { user: user || "", shortURL: urlDatabase[req.body.longURL], longURL: urlDatabase['req.params.longURL'] };
  const templateVars = { user: user || "", shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL };
  res.render("urls_show", templateVars);
  console.log("shortURL-->", req.params.shortURL);
  console.log("longURL-->", urlDatabase[req.params.shortURL].longURL);
  console.log("UserID-->", urlDatabase[req.params.shortURL].userID);
});

app.get("/", (req,res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req,res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req,res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
