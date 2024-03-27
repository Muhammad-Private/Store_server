const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 5000;
const cors = require('cors');
const bodyParser=require(`body-parser`);
const Auth_routes=require(`./routes/Auth_routes`);
const Products_routes=require(`./routes/products_routes`);
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv');
dotenv.config()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use("/auth",Auth_routes);
app.use("/",Products_routes);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

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
