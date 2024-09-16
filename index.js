const express = require("express");
const { connect } = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const fileUpload = require("express-fileupload");


const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use(fileUpload());
app.use("/uploads", express.static(__dirname + '/uploads'));

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.use(notFound);
app.use(errorHandler);

connect(process.env.Mongo_URI)
  .then(() =>
    app.listen(5000, () => {
      console.log("Running in the port 5000");
    })
  )
  .catch((error) => {
    console.error("Error in mongodb connection is: ", error);
  });
