import PurchaseOrderService from "../services/purchaseOrderService.js";

export const createPO = async (req, res) => {
  try {
    const { supplierId, productId, quantity } = req.body;

    const data = await PurchaseOrderService.createOrder({
      supplierId,
      productId,
      quantity,
      files: req.files,
    });

    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllPO = async (req, res) => {
  const data = await PurchaseOrderService.getAll();
  res.json(data);
};

export const updateStatus = async (req, res) => {
  try {
    const data = await PurchaseOrderService.updateStatus(
      req.params.id,
      req.body.status
    );
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const cancelPO = async (req, res) => {
  try {
    const data = await PurchaseOrderService.cancel(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};