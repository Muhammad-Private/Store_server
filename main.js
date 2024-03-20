const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 5000;
const cors = require('cors');
const Auth_routes=require(`./routes/Auth_routes`);
const products_routes=require(`./routes/products_routes`);
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv');
dotenv.config()

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/auth",Auth_routes);
app.use("/",products_routes);

// app.use("/protected_routes",protected_routes);


mongoose.connect(process.env.url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB successfully ');
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB:', err);
  });








app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
