const express=require(`express`);
const Router=express.Router();
const products_controller=require(`../controllers/products_controller`);


Router.post(`/AddProduct`,products_controller.AddProduct)
Router.get(`/getproducts`,products_controller.getproducts)
Router.delete(`/deleteProduct`,products_controller.deleteProduct)

module.exports=Router;