import express from "express";

import {
  registerUser,
  authUser,
  getUser,
  updateUser,
} from "../controllers/userControllers.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(registerUser)
  .get(protect, getUser)
  .put(protect, updateUser);
router.post("/login", authUser);

export default router;
