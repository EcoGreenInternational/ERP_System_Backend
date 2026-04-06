import express from "express";
import upload from "../middleware/upload.js";
import {
  createPO,
  getAllPO,
  updateStatus,
  cancelPO,
} from "../controller/purchaseOrderController.js";

const router = express.Router();

router.post("/", upload.array("images", 3), createPO);
router.get("/", getAllPO);
router.put("/:id", updateStatus);
router.put("/cancel/:id", cancelPO);

export default router;