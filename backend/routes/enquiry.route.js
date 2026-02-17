import express from "express"
import { enquiryfield, getAllEnquiries, deleteEnquiry } from "../controller/enquiry.controller.js"
import protect from "../middleware/protect.js"
import { isAdmin } from "../middleware/admin.js"

const router = express.Router()

// Public route - submit enquiry
router.post("/detail", enquiryfield)

// Admin routes - enquiry management
router.get("/all", protect, isAdmin, getAllEnquiries)
router.delete("/:id", protect, isAdmin, deleteEnquiry)

export default router

