
const express=require(`express`);
const Router=express.Router();

const VerifyJwt=require(`../jwt/verifyJwt`)

Router.use(VerifyJwt);


module.exports=Router;


