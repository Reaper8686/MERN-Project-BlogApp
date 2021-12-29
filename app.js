const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const app = express();

//Routes
const AuthRouter = require("./routes/auth");
const CategoryRouter = require("./routes/category");
const UserRouter = require("./routes/user");
const ArticleRouter = require("./routes/article");

//DATABASE connection
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("DATABASE connected");
  })
  .catch("DATABASE error!!!!!!!!");

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Routers
app.use("/api", AuthRouter);
app.use("/api", CategoryRouter);
app.use("/api", UserRouter);
app.use("/api", ArticleRouter);

//port
const port = process.env.PORT || 8000;

//server connection
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
