import { upload } from "../config/cloudinary.js";
import express from 'express';
import { deleteProduct,getAllProducts,getProductById, increaseStock, reduceStock, updateProduct } from "../controller/productController.js";


const productRouter = express.Router();
//category routes



productRouter.get('/getAll',getAllProducts);

productRouter.get('/:id', getProductById);

productRouter.put('/:id', 
    upload.fields([
        { name: "mainImage", maxCount: 1 },
        { name: "additionalImages", maxCount: 3 }
    ]), 
    updateProduct
);

productRouter.delete('/:id', deleteProduct );

productRouter.patch('/reduce-stock',reduceStock);

productRouter.patch('/increase-stock',increaseStock);


export default productRouter;