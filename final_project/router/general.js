const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let axios = require("axios");
const public_users = express.Router();

// User Registration
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({"username": username, "password": password});
  return res.status(201).json({ message: "User successfully registered" });
});

// Get all books
public_users.get('/', (req, res) => {
  res.json({ books });
});

// Get book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get books by author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author === author);

  if (booksByAuthor.length > 0) {
    res.json(booksByAuthor);
  } else {
    res.status(404).json({ message: "No books found by this author" });
  }
});

// Get books by title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(book => book.title === title);

  if (booksByTitle.length > 0) {
    res.json(booksByTitle);
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

// Get book reviews
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.json(books[isbn].reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
  console.log(books[isbn]);
});

// Getall Books with Async Await
async function getBooks() {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log("Books:", response.data.books);
    return response.data.books;
  } catch (error) {
    console.error("Error fetching books:", error.response?.data || error.message);
    throw error;
  }
}

function getBookByISBN(isbn) {
  return axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
      console.log("Book by ISBN:", response.data);
      return response.data;
    })
    .catch(error => {
      console.error("Error fetching book by ISBN:", error.response?.data || error.message);
      throw error;
    });
}


async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log("Books by Author:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching books by author:", error.response?.data || error.message);
    throw error;
  }
}

async function getBookByTitle(title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    console.log("Books by Title:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching books by title:", error.response?.data || error.message);
    throw error;
  }
}

// Test API calls

// console.log("Getting all books");
// getBooks();

// console.log("Getting book by ISBN");
// getBookByISBN('3'); // isbn = '3'

//console.log("Getting book by Title");
//getBookByTitle('One Thousand and One Nights');

//console.log("Getting books by Author");
//getBooksByAuthor('Samuel Beckett');

module.exports.general = public_users;
