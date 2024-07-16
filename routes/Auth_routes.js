const express=require(`express`);
const Router=express.Router();
const AuthControler=require(`../controllers/Auth_controller`)



Router.post(`/Register`,AuthControler.Register)
Router.post(`/login`,AuthControler.Login)
Router.post(`/forgotpassword`,AuthControler.ForgotPassword)
Router.post(`/updatepassword`,AuthControler.updatePassword)
Router.post(`/logout`,AuthControler.Logout)


module.exports=Router;