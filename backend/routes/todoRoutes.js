import express from "express";

import {
  addTodo,
  getTodo,
  getTodos,
  deleteTodo,
  editTodo,
  markAsDoneTodo,
} from "../controllers/todoControllers.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, addTodo);
router.route("/").put(protect, markAsDoneTodo);
router.route("/all").get(protect, getTodos);
router
  .route("/:id")
  .delete(protect, deleteTodo)
  .put(protect, editTodo)
  .get(protect, getTodo);

export default router;
