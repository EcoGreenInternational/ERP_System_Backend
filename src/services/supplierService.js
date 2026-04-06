import Supplier from "../model/supplierModel.js";

// ✅ GET ACTIVE SUPPLIERS (for dropdown)
export const getActiveSuppliers = async () => {
  return await Supplier.find({ isActive: true })
    .select("_id fullName contactName phoneNumber email");
};