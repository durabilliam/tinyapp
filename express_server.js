const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
//const cookieParser = require("cookie-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const { checkEmail, generateRandomString, fetchUserById, checkEmailAndPw, urlsForUser } = require("./helpers.js");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
//app.use(cookieParser());
app.use(
  cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
  })
);


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
};

app.get("/urls", (req,res) => {
  if (req.session['user_id']) {
    const id = req.session['user_id'];
    const result = urlsForUser(id, urlDatabase);
    const user = fetchUserById(id, users);
    const templateVars = { user: user || "", urls: result.data };
    res.render('urls_index', templateVars);
  } else {
    //res.redirect('/login')
    res.send("Please login http://localhost:8080/login  or Register at http://localhost:8080/register");
  }
});

app.get("/urls/new", (req,res) => {
  if (req.session['user_id']) {
  //const templateVars = { user: req.cookies.id || ""};
    const id = req.session['user_id'];
    const user = fetchUserById(id, users);
    const templateVars = { user: user || ""};
    res.render("urls_new", templateVars);
  } else {
    res.redirect('/login');
  }
});


app.post("/logout", (req, res) => {
  req.session['user_id'] = null;
  res.redirect('/urls');
});

app.get("/login", (req, res) => {
  //console.log(req.params);
  const id = req.session['user_id'];
  const user = fetchUserById(id, users);
  const templateVars = { user: user || ""};
  res.render("urls_login", templateVars);
});

app.get("/register", (req, res) => {
  const id = req.session['user_id'];
  const user = fetchUserById(id, users);
  const templateVars = { user: user || ""};
  res.render("urls_register", templateVars);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password  = req.body.password;
  //console.log("login", email, password, users);
  const result = checkEmailAndPw(email, password, users);
  if (result.error) {
    return res.send(403, "Email or Password not found");
  }
  req.session['user_id'] = result.data.id;
  res.redirect('/urls');
  
});

app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password  = bcrypt.hashSync(req.body.password, 10);
  if (!email) {
    res.send(400, "missing email or password");
  } else if (checkEmail(email, users)) {
    res.send(400, "email already exist!!");
  } else {
    users[id] = {id, email, password};
    req.session['user_id'] = id;
    res.redirect('/urls');
  }
});

app.post("/urls", (req, res) => {
  if (req.session['user_id']) {
  //if (req.body) {
    //Generates smaller Url and updates database
    const small = generateRandomString();
    const userid = req.session['user_id'];
    urlDatabase[small]  = {longURL: ('http://') + req.body.longURL, userID: userid};
    res.redirect('/urls/' + small);
  } else {
    req.send("Please Login to continue");
  }
});


app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.session['user_id']) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  } else {
    req.send("Please Login to continue");
  }

});


app.post("/urls/:shortURL", (req, res) => {
  if (req.session['user_id']) {
  // // console.log("short:" )
  // console.log("LOOKING", req.body.longURL);
  // console.log("LOOKING", req.params.shortURL);
  // console.log("----", urlDatabase)
    const userid = req.session['user_id'];
    urlDatabase[req.params.shortURL]  = {longURL: ('http://') + req.body.longURL, userID: userid};
    //urlDatabase[req.params.shortURL] = req.body.longURL;
    res.redirect('/urls');
  } else {
    req.send("Please Login to continue");
  }
});

app.get("/u/:shortURL", (req, res) => {
  if (req.body) {
    res.redirect(urlDatabase[req.params.shortURL].longURL);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  if (req.session['user_id']) {
    const id = req.session['user_id'];
    const user = fetchUserById(id, users);
    const templateVars = { user: user || "no url for User", shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL };
    res.render("urls_show", templateVars);
  } else {
    res.send("Please login http://localhost:8080/login to continue");
  }
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
