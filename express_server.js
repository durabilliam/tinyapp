const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(cookieParser());

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

const userCreate = function(email, password){
  if (!email || !password){
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
  for (let id in users) {
    if (password === users[id].password && email === users[id].email) {
      console.log(password, users[id].password)
      console.log(email, users[id].password)
      return { error: null, data: users[id] }
    }
  }
  return { error:"not found", data: null } 
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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


app.get("/urls", (req,res) => {
  //console.log("req", req.cookies);
  let id = req.cookies['user_id']
  const user = fetchUserById(id, users) 
  const templateVars = { user: user || "", urls: urlDatabase };
  //const templateVars = { username: req.cookies["username"] || "", urls: urlDatabase };
  res.render('urls_index', templateVars);
  //Linking object to */urls_index.js
});

app.get("/urls/new", (req,res) => {
  //const templateVars = { user: req.cookies.id || ""};
  let id = req.cookies['user_id']
  const user = fetchUserById(id, users)
  const templateVars = { user: user || ""};
  res.render("urls_new", templateVars);
});


app.post("/logout", (req, res) => {
  //console.log(req.params);
  //res.cookie('username', req.body.username)
  //'user_id', result.data.id
  // let id = req.cookies['user_id']
  // const user = fetchUserById(id, users);
  console.log(req.body)
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
  let password  = req.body.password
  //let newUser = {id};
  console.log(req.body);
  if (!(userCreate(email, password))) {
    res.send (400, "missing field")
  } else if (checkEmail(email, users)){
    res.send (400, "email exist!!")
  } else {
  //console.log(id, req.body.email, req.body.password)
  console.log(id, email, password);
  //console.log(newUser);
  users[id] = {id, email, password}
  console.log(users)
  res.cookie('user_id', id)
  console.log(users[id])
  res.redirect('/urls');
  }
});

app.post("/urls", (req, res) => {
  //console.log(req.body);
  if (req.body) {
    let small = generateRandomString();
    urlDatabase[small] = ('http://') + req.body.longURL;
    res.redirect('/urls/' + small);
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
  console.log(urlDatabase)
  // console.log(req.params)
  // console.log([req.params.shortURL])
  res.redirect(`/urls/` + req.params.shortURL);

});

app.get("/u/:shortURL", (req, res) => {
  if (req.body) {
    res.redirect(urlDatabase[req.params.shortURL]);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  //const templateVars = { user: req.cookies.id || "", shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  let id = req.cookies['user_id']
  const user = fetchUserById(id, users)
  const templateVars = { user: user || "", shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
  //console.log(req.params);
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
