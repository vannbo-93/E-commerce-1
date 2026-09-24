/** @format */

import { Router } from "express";
import { register, login, logout } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// مؤقتًا في userRoute.ts للاختبار
router.get("/me", protect, (req, res) => {
  res.json({ message: "You are authenticated", user: req.user });
});

export default router;
