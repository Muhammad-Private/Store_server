const express=require(`express`);
const Router=express.Router();
const {AddProduct,getproducts,deleteProduct}=require(`../controllers/products_controller`);


Router.post(`/AddProduct`,AddProduct)
Router.get(`/getproducts`,getproducts)
Router.delete(`/deleteProduct`,deleteProduct)

module.exports=Router;