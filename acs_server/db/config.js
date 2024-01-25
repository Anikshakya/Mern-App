// const moongose=require("mongoose");
// moongose.connect("mongodb://localhost:27017/acs_app");

const User=require('./user');
const mongoose = require("mongoose");

// Connection options to include automatic creation of the database
const options = {
  dbName: "acs_app", // DB name
};

mongoose.connect("mongodb://localhost:27017", options)
  .then(async () => {
    console.log("=====> Connected to MongoDB successfully!");

    // Check if the user table already exists
    const userCount = await User.countDocuments({}).exec();

    if (userCount === 0) {
      // Encrypt hash password
      const bcrypt = require("bcrypt");
      // If no users exist, create an admin user
      var name = "admin";
      var email = "admin@admin.com";
      const hashedPassword = await bcrypt.hash("admin", 12);
      var role = "admin";
      await User.create({ email, password: hashedPassword, name, role});
      console.log("=====> Admin user created successfully!");
    } else {
      console.log("=====> User table already populated, skipping admin user creation.");
    }
  })
  .catch((err) => {
    console.error("=====> Error connecting to MongoDB:", err);
  });