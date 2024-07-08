const ProductsSchema = require('../models/Products_schema');
const multer = require('multer');
const path = require('path');

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





async function AddProduct(req, res) {
  try {
    const { ProductName, Price } = req.body;
    const imagePath = req.file.path;
    console.log(req.body);
    // const newProduct = new ProductsSchema({
    //   ProductName,
    //   Price,
    //   Image:imagePath
    // });
    const newProduct = new ProductsSchema({
      ProductName:"55",
      Price:"5555",
      Image:"imagePath"
    });
    await newProduct.save();
    res.status(201).json({ message: "Product added successfully" });
  } 
  catch (error) 
  {
    res.status(500).json({ message: error.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const { _id } = req.body;
    const existingProduct = await ProductsSchema.findOne({ _id });
    if (!existingProduct) 
    {
      return res.status(404).json({ message: "Failed to delete. Product not found." });
    }
    // Delete the product
    await ProductsSchema.deleteOne({ _id });
    return res.status(200).json({ message: "Product deleted successfully." });
  } 
  catch (error) 
  {
    return res.status(500).json({ message: error.message });
  }
}

async function getproducts(req, res) {
  try {
    const products = await ProductsSchema.find();
    res.status(200).json({ data:products });
  } 
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  AddProduct,
  getproducts,
  deleteProduct,
  upload 
};
