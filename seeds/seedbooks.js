const mongoose = require("mongoose");
const Books = require("../models/books");
mongoose.connect(
  "mongodb+srv://Aryan:aryanhello@library.j96grbo.mongodb.net/?retryWrites=true&w=majority"
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const bookstitle = [
  "Rich Daddy Poor Daddy",
  "Do Epic Shit",
  "The Last Lecture",
  "The Mystery",
  "The Unknown",
  "Destiny",
  "Factfullness",
  "Atomic Habits",
  "The Monk Who Sold His Ferrari",
  "KC college",
  "The C++",
];

const authors = [
  "Aryan Singh",
  "Ganesh Gajelly",
  "Dhruv Jain",
  "Apurav Kumavat",
  "Heta Purohit",
  "Samiya Singh",
  "Anubhav Singh",
  "Unknown",
  "Alphin Stivi",
  "Arya Shah",
  "Reshma Rajan",
  "Seema Singh",
];

const category = [
  "Romance",
  "Science",
  "Fiction",
  "Drama",
  "Reality",
  "Biography",
];



const insertbooks = async () => {
  for (let index = 0; index < 5; index++) {
    const randombooks = Math.floor(Math.random() * 11);
    const randomauthors = Math.floor(Math.random() * 10);
    const categories = Math.floor(Math.random() * 6);

    const book = new Books({
      collegeid: 1111,
      location: "college",
      title: `${bookstitle[randombooks]}`,
      ISBN: Math.floor(Math.random() * 2000),
      authors: [`${authors[randomauthors]}`],
      category: [`${category[categories]}`],
      stock: Math.floor(Math.random() * 20),
    });

    await book.save();
  }
};

insertbooks().then(() => {
  mongoose.connection.close();
});
