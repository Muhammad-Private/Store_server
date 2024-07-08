const express=require(`express`);
const Router=express.Router();
const {upload,AddProduct,getproducts,deleteProduct}=require(`../controllers/products_controller`);


Router.post(`/AddProduct`,upload.single('Image'),AddProduct)
Router.get(`/getproducts`,getproducts)
Router.delete(`/deleteProduct`,deleteProduct)

module.exports=Router;