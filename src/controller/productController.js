import Product from "../model/productModel.js";


export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .select("productName price item_count mainImage");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

   
    await Product.findByIdAndUpdate(id, { isActive: false });

    res.status(200).json({
        message: 'Product deleted successfully'
    });
});

// Function to handle real-time stock reduction
export const reduceStock = asyncErrorHandler(async (req, res, next) => {
    const { productId, quantity } = req.body;
    const soldProduct = await Product.findByIdAndUpdate(
        productId,
        { $inc: { item_count: -quantity } }, 
        { 
            new: true,
            runValidators: true 
        }
    );

    if (!soldProduct) {
        return res.status(404).json({
            status: 'fail',
            message: 'Product not found'
        });
    }
    res.status(200).json({
        status: 'success',
        message: 'Stock updated successfully',
        data: {
            productId: soldProduct._id,
            remainingStock: soldProduct.item_count
        }
    });
});
 // Function to handle real-time stock increase 
export const increaseStock = asyncErrorHandler(async (req, res, next) => {
    const { productId, quantity } = req.body;
    const restockedProduct = await Product.findByIdAndUpdate(
        productId,
        { $inc: { item_count: quantity } }, 
        { 
            new: true,
            runValidators: true 
        }
    );
    if (!restockedProduct) {
        return res.status(404).json({
            status: 'fail',
            message: 'Product not found'
        });
    }
    res.status(200).json({
        status: 'success',
        message: 'Stock updated successfully',
        data: {
            productId: restockedProduct._id,
            newStock: restockedProduct.item_count
        }
    });
});


const deleteFromCloudinary = async (url) => {
    const publicId = extractPublicId(url);
    if (publicId) {
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error("Cloudinary Deletion Error:", error);
        }
    }
};

const extractPublicId = (url) => {
    if (!url) return null;
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;
    let startIndex = uploadIndex + 1;
    if (parts[startIndex].startsWith('v')) startIndex++; 
    const pathAfterUpload = parts.slice(startIndex).join('/');
    return pathAfterUpload.substring(0, pathAfterUpload.lastIndexOf('.'));
};

