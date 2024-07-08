const express=require(`express`);
const Router=express.Router();
const products_controller=require(`../controllers/products_controller`);
const multer = require('multer');

// Set up Multer storage and file filter
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Use unique filename
  }
});

const upload = multer({ storage: storage });


Router.post(`/AddProduct`,upload.single('Image'),products_controller.AddProduct)
Router.get(`/getproducts`,products_controller.getproducts)
Router.delete(`/deleteProduct`,products_controller.deleteProduct)

module.exports=Router;