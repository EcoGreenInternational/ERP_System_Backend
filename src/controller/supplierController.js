import { getActiveSuppliers } from "../services/supplierService.js";

// GET suppliers for purchase order
export const getSuppliersForPO = async (req, res) => {
  try {
    const suppliers = await getActiveSuppliers();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};