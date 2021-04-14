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
  }
}


// const checkEmailAndPw = function (email, password, users) {
//   for (let id in users) {
//     console.log("password", password, users[id].password)
//     console.log("email", email, users[id].email) 
//     console.log("comp pw", password === users[id].password)
//     console.log("comp email", email === users[id].email)
//     console.log("Id:", id);
//     if (password === users[id].password && email === users[id].email) {
//       return true;
//     }
//   }
//   return false
// }
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
console.log(checkEmailAndPw("user2@example.com", "dishwasher-funk", users))







// const fetchUserById = function (id, userDatabase){
//   for (let userId in userDatabase){
//     if (userId === id){
//       return userDatabase[userId]
//     }
//   }return undefined;
// }

// console.log(fetchUserById("user2RandomID", users))

// users[id] = {id, email, password}
// console.log (id, email, passwaord)


// const checkEmail = function (email)
// Object.keys(users).forEach(function(key){
//    if (email === users[key].email){
//      return 
//    }
//  });

//console.log(users[key])
// for (let user in users){
//   console.log(users[user].id)
//   console.log(users[user].email)
//   console.log(users[user].password)
// }

// <form class="card text-center" action="/logout" method="POST">
// <input class="form-control" type="text" name="" placeholder="user" style="width: 300px; margin: 0.5 em">
// <button type="submit" class="btn btn-primary ">Logout</button></form>
// <p class="card-text">Logged in as: <%= user.email %></p>
// <% } else { %>
// <form class="card text-center" action="/login" method="POST">
// <input class="form-control" type="text" name="user" placeholder="user" style="width: 300px; margin: 0.5 em">
// <button type="submit" class="btn btn-primary ">Login</button></form>