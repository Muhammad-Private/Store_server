const express = require(`express`);
const Router = express.Router();
const Products_Controller = require(`../controllers/products_controller`);
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'Uploads')
    },
    filename: function (req, file, cb) {
        let uniqueSuffix = new Date().toISOString()+file.originalname
        cb(null, uniqueSuffix)
    }
})

const upload = multer({ storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }
 })


Router.post(`/AddProduct`, upload.single('Image'), Products_Controller.AddProduct)
Router.get(`/getproducts`, Products_Controller.getProducts)
Router.delete(`/deleteProduct`, Products_Controller.deleteProduct)

module.exports = Router;