import getCloudinary from "../util/cloudinary.js";
import streamifier from "streamifier";

// ✅ Format: purchaseorder_{productId}_{YYYY-MM-DD}_{index}.{ext}
const generateFileName = (productId, file, index) => {
  const date = new Date().toISOString().split("T")[0]; // 2024-01-15
  const ext = file.mimetype.split("/")[1];             // jpg, png, webp
  const idx = String(index + 1).padStart(3, "0");      // 001, 002...
  return `purchaseorder_${productId}_${date}_${idx}.${ext}`;
};

export const uploadImagesToCloudinary = async (files, productId) => {
  const cloudinary = getCloudinary();
  const urls = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileName = generateFileName(productId, file, i);

    const url = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "purchase_orders",
          public_id: fileName,         // ✅ custom name
          use_filename: true,
          unique_filename: false,      // ✅ keep our exact name
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      );

      // ✅ pipe buffer directly to cloudinary — no disk needed
      streamifier.createReadStream(file.buffer).pipe(stream);
    });

    urls.push(url);
  }

  return urls;
};
