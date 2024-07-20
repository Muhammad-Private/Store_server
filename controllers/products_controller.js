const ProductsSchema = require('../models/Products_schema');
const fs = require('fs');
const path = require('path');


async function AddProduct(req, res) {
  try {
    const { ProductName, Price } = req.body;
    const path=(req.file.path)
    const newProduct = new ProductsSchema({
      ProductName,
      Price,
      Image: path
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}



async function deleteProduct(req, res) {
  try {
    const { _id } = req.body;
    const existingProduct = await ProductsSchema.findOne({ _id });

    if (!existingProduct) {
      return res.status(404).json({ message: "Failed to delete. Product not found." });
    }

    // Delete the image file from the file system
    if (existingProduct.Image) {
      const imagePath = path.join(__dirname, '..', existingProduct.Image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting the file:', err);
        }
      });
    }
    // Delete the product from the database
    await ProductsSchema.deleteOne({ _id });
    return res.status(200).json({ message: "Product deleted successfully." });
  } 
  catch (error) {
    return res.status(500).json({ message: error.message });
  }
}



async function getProducts(req, res) {
  try {
    const products = await ProductsSchema.find();
    res.status(200).json({ data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  AddProduct,
  getProducts,
  deleteProduct,
};
