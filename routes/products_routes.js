const express=require(`express`);
const Router=express.Router();
const Products_Controller=require(`../controllers/products_controller`);


Router.post(`/AddProduct`,Products_Controller.AddProduct)
Router.get(`/getproducts`,Products_Controller.getproducts)
Router.delete(`/deleteProduct`,Products_Controller.deleteProduct)

module.exports=Router;