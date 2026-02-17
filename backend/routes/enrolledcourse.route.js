import express from "express"

import { isAdmin } from "../middleware/admin.js";
import protect from "../middleware/protect.js";
import { addProduct, deleteProduct, getAllProducts, updateProduct, getCourseById } from "../controller/course.controller.js";

const router =express.Router()


router.post("/addproduct",protect,isAdmin,addProduct);
router.get("/getallproduct", getAllProducts);
router.get("/course/:id", getCourseById);
router.put("/product/:id", protect, isAdmin, updateProduct);
router.delete("/product/:id", protect, isAdmin, deleteProduct);

export default router
