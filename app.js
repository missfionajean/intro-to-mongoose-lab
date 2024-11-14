// importing locally defined model (must start with "./")
const Todo = require("./models/customer.js");

// setting up dot env for use
const dotenv = require("dotenv");
dotenv.config();

// setting up mongoose for use
const mongoose = require("mongoose");

// imports prompt-sync package
const prompt = require("prompt-sync")();

// sets up user prompt for their name
const username = prompt("What is your name? ");

console.log(`Your name is ${username}`);
