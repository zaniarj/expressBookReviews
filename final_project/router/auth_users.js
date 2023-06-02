const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username:"user1", password:"password1"}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return false;
    } else {
      return true;
    }
  }


const authenticatedUser = (username,password)=>{ //returns boolean

    let validator = users.filter((user)=>{
        return (user.username == username && user.password == password)
    });
    if (validator.length > 0){
        return true;
    }else{
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(400).json({message: "Error logging in"});
    }
   if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const bookId = req.params.isbn; 
  const review = req.body.review;
  const username = req.session.authorization.username;
  const reviews = books[bookId].reviews;
  const title = books[bookId].title;
    if (reviews.hasOwnProperty(username)){
      reviews.username = review;
      return res.status(200).send(`Review for ${title} Updated`);
    }else{
      reviews[username] = review
      return res.status(200).send(`Review for ${title} Added`);
    }
  

});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const bookId = req.params.isbn; 
  const username = req.session.authorization.username;
  const reviews = books[bookId].reviews;
  const title = books[bookId].title;
    if (reviews.hasOwnProperty(username)){
      delete reviews[username];
      return res.status(200).send(`Review for ${title} Deleted`);
    }else{
      return res.status(200).send(`No Review for ${title} Exists`);
    }
  

});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
