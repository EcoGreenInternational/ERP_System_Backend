import express from "express";
import { getSuppliersForPO } from "../controller/supplierController.js";

const router = express.Router();

// 🔥 Only for Purchase Order usage
router.get("/", getSuppliersForPO);

export default router;