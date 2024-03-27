const express=require(`express`);
const Router=express.Router();
const products_controller=require(`../controllers/products_controller`);
const multer = require('multer');
const storage = multer.memoryStorage(); // Store uploaded file in memory as buffer
const upload = multer({ storage: storage });


Router.post(`/AddProduct`,upload.single('Image'),products_controller.AddProduct)
Router.get(`/getproducts`,products_controller.getproducts)
Router.delete(`/deleteProduct`,products_controller.deleteProduct)

module.exports=Router;