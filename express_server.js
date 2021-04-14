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

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls", (req,res) => {
  //console.log("req", req.cookies);
  const templateVars = { username: req.cookies["username"] || "", urls: urlDatabase };
  res.render('urls_index', templateVars);
  //Linking object to */urls_index.js
});

app.get("/urls/new", (req,res) => {
  const templateVars = { username: req.cookies["username"] || ""};
  res.render("urls_new", templateVars);
});

app.post("/login", (req, res) => {
  //console.log(req.body);
  res.cookie('username', req.body.username)
  //console.log(username);
  res.redirect('/urls');
});

app.post("/logout", (req, res) => {
  console.log(req.params);
  //res.cookie('username', req.body.username)
  res.clearCookie('username', req.body.username)
  res.redirect('/urls');
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
  const templateVars = { username: req.cookies["username"] || "", shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
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
