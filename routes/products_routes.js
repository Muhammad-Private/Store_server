const express = require(`express`);
const Router = express.Router();
const Products_Controller = require(`../controllers/products_controller`);
const multer = require('multer')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
  });




const upload = multer({ storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }
 })


Router.post(`/AddProduct`, upload.single('Image'), Products_Controller.AddProduct)
Router.get(`/getproducts`, Products_Controller.getProducts)
Router.delete(`/deleteProduct`, Products_Controller.deleteProduct)

module.exports = Router;