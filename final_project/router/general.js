const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username, password){
        if(isValid(username)){
            users.push({"username":username, "password":password});
            return res.status(200).json({msg:"The user has been added!"})
        }else{
            return res.status(400).json({msg:"The user Exists!"})
        }
    }else{
        return res.status(400).json({msg:"Username/Password not valid!!!"})
    }
});

// Get the book list available in the shop
public_users.get('/',async (req, res)=> {
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN(id from database)
public_users.get('/isbn/:isbn',async (req, res)=> {
  const isbn = req.params.isbn;
  let filteredBook = books[isbn];

  if (filteredBook) {
  return res.status(200).json(filteredBook);
  }else{
    return res.status(400).json({msg: `Book with id ${isbn} not found`})
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',async (req, res)=> {
  let result = [];
  author = req.params.author;
  for (let id in books){
    if (books[id].author == author){
      result.push(books[id])
    }
  }
  if (result.length>0){
    return res.status(200).send(result)
  }else{
    return res.status(404).json({status: `No books found with ${author}`})
  }
});

// Get all books based on title
public_users.get('/title/:title',async (req, res)=> {
  let result = [];
  title = req.params.title;
  for (let id in books){
    if (books[id].title == title){
      result.push(books[id])
    }
  }
  if (result.length>0){
    return res.status(200).send(result)
  }else{
    return res.status(404).json({status: `No books found with ${title}`})
  }
});


//  Get book review
public_users.get('/review/:isbn',async (req, res)=> {
  const isbn = req.params.isbn;
  let filteredBook = books[isbn];

  if (filteredBook) {
  return res.status(200).json({"review":filteredBook.review});
  }else{
    return res.status(400).json({msg: `Book with id ${isbn} not found`})
  }
});

module.exports.general = public_users;
