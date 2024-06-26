const mongoose = require("mongoose");

const conn = async (req, res) => {
  try {
    await mongoose
      .connect("mongodb+srv://rahulkumar:rahul@cluster0.6bhd5cy.mongodb.net/")
      .then(() => {
        console.log("mongo connected");
      });
  } catch (error) {
    console.log(error);
  }
};
conn();
