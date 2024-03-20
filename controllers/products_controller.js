const ProductsSchema = require('../models/Products_schema');
const multer = require('multer'); // Assuming you already imported multer

// ... other imports
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage })


async function AddProduct(req, res) {
    try {
       const { ProductName ,Price ,Img}=req.body;
       const newProduct = new ProductsSchema({
        ProductName,
        Price,
        Img
      });
      await newProduct.save();
      console.log(newProduct);
      res.status(201).json({message:"product add successfuly"})
    } 
    catch (error) {

      res.status(501).json({message:error.message})
        
    }
  }



// async function AddProduct(req, res) {
//   try {
//     await upload.single('Img')(req, res, async (err) => {
//       if (err) {
//         // More specific error handling based on error type
//         let errorMessage = 'Image upload failed';
//         if (err.code === 'LIMIT_FILE_SIZE') {
//           errorMessage = 'Image size exceeds allowed limit.';
//         } else if (err.type === 'mimetype') {
//           errorMessage = 'Invalid image format. Please upload a valid image file.';
//         }
//         return res.status(400).json({ message: errorMessage });
//       }

//       const { ProductName, Price } = req.body;
//       const imgPath = req.file.path;

//       const newProduct = new ProductsSchema({
//         ProductName,
//         Price,
//         Img: imgPath,
//       });

//       await newProduct.save();
//       console.log(newProduct);
//       res.status(201).json({ message: "Product added successfully" });
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error adding product" });
//   }
// }





  async function getproducts(req, res) {
    try {
        const products=await ProductsSchema.find()
        console.log(products);
      res.status(201).json({products})
    } 
    catch (error) 
    {
      res.status(501).json({message:error.message})
        
    }
  }


  
  module.exports={
    AddProduct,
    getproducts,
  }