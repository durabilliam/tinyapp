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

//check for user/ redirect if needed.
//Return HTML with users urls, option to change or delete
//link in short url for option to go to web page.
app.get("/urls", (req,res) => {
  if (req.session['user_id']) {
    const id = req.session['user_id'];
    const user = fetchUserById(id, users);
    const result = urlsForUser(id, urlDatabase);
    const templateVars = { user: user || "", urls: result.data };
    res.render('urls_index', templateVars);
  } else {
    res.redirect('/login')
  }
});

//check for user/ redirect if needed.
//Return HTML with place to add new shortURL
//link in short url for option to go to web page.
app.get("/urls/new", (req,res) => {
  if (req.session['user_id']) {
    const id = req.session['user_id'];
    const user = fetchUserById(id, users);
    const templateVars = { user: user || ""};
    res.render("urls_new", templateVars);
  } else {
    res.redirect('/login');
  }
});

//log out user.
//Remove cookies
app.post("/logout", (req, res) => {
  req.session['user_id'] = null;
  res.redirect('/urls');
});

//return HTML to log in existing user
app.get("/login", (req, res) => {
  const id = req.session['user_id'];
  const user = fetchUserById(id, users);
  const templateVars = { user: user || ""};
  res.render("urls_login", templateVars);
});

//return HTML to Register New User
app.get("/register", (req, res) => {
  const id = req.session['user_id'];
  const user = fetchUserById(id, users);
  const templateVars = { user: user || ""};
  res.render("urls_register", templateVars);
});

//check for user/ redirect if needed.
//Check secuity- email password/
//Send to main urls page
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password  = req.body.password;
  const result = checkEmailAndPw(email, password, users);
  if (result.error) {
    return res.send(403, "Email or Password not found");
  }
  req.session['user_id'] = result.data.id;
  res.redirect('/urls');
  
});

//Create user is not already registered
//Check all fields
//Create new userid and cookies
//Send to main urls page
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

//check for user/ redirect if needed.
//Take in users long url 
//genertate new shortUrl and send to it's edit page.
app.post("/urls", (req, res) => {
  if (req.session['user_id']) {
    const small = generateRandomString();
    const userid = req.session['user_id'];
    urlDatabase[small]  = {longURL: req.body.longURL, userID: userid};
    res.redirect('/urls/' + small);
  } else {
    res.send("Please Login to continue");
  }
});

//check for user/ redirect if needed.
//user can only delete Url they own
app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.session['user_id']) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  } else {
    res.send("Please Login to continue");
  }

});

//check for user/ redirect if needed.
//alter url if needed and update object database.
app.post("/urls/:shortURL", (req, res) => {
  if (req.session['user_id']) {
    const userid = req.session['user_id'];
    if (userid === urlDatabase[req.params.shortURL].userID) {
    urlDatabase[req.params.shortURL]  = {longURL: req.body.longURL, userID: userid};
    res.redirect('/urls');
    } else {
    res.send("Sorry!!  Cannot alter another user's Url!!!");
  }
} else {
  res.send("Please Login to continue");
}


});

app.get("/u/:shortURL", (req, res) => {
  if (req.body) {
    res.redirect(urlDatabase[req.params.shortURL].longURL);
  }
});

//send HTML of Short and LongURl
//Option to edit is necessary
app.get("/urls/:shortURL", (req, res) => {
  if (req.session['user_id']) {
    const id = req.session['user_id'];
    const user = fetchUserById(id, users);
    const templateVars = { user: user || "no url for User", shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL };
    res.render("urls_show", templateVars);
  } else {
    res.send("Please login to continue");
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
