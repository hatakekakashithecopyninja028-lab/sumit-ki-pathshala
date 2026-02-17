import express from "express"
import { login, signup, getMe, getAllUsers, deleteUser } from "../controller/auth.controller.js"
import protect from "../middleware/protect.js"
import { isAdmin } from "../middleware/admin.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.get("/me", protect, getMe)
router.get("/users", protect, isAdmin, getAllUsers)
router.delete("/users/:id", protect, isAdmin, deleteUser)

export default router

