import PurchaseOrder from "../model/purchaseOrderModel.js";
import Supplier from "../model/supplierModel.js";
import Product from "../model/productModel.js";
import { uploadImagesToCloudinary } from "./uploadService.js"; // ✅ use the upload service

class PurchaseOrderService {
  async createOrder({ supplierId, productId, quantity, files }) {
    // 1. Supplier
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) throw new Error("Supplier not found");

    // 2. Product
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    // 3. Upload images — no disk, no manual cleanup needed
    let imageUrls = [];
    if (files && files.length > 0) {
      imageUrls = await uploadImagesToCloudinary(files, productId); // ✅ pass productId for naming
    }

    // 4. Save
    return await PurchaseOrder.create({
      supplierId: supplier._id,
      supplierName: supplier.fullName,
      productId: product._id,
      productName: product.productName,
      quantity,
      images: imageUrls,
      status: "pending",
    });
  }

  async getAll() {
    return PurchaseOrder.find().sort({ createdAt: -1 });
  }

  async updateStatus(id, status) {
    const order = await PurchaseOrder.findById(id);
    if (!order) throw new Error("Order not found");

    order.status = status;
    return await order.save();
  }

  async cancel(id) {
    const order = await PurchaseOrder.findById(id);
    if (!order) throw new Error("Order not found");

    order.status = "cancelled";
    return await order.save();
  }
}

export default new PurchaseOrderService();
