import asyncHandler from "express-async-handler";

import Todo from "../models/Todo.js";
import User from "../models/User.js";

export const addTodo = asyncHandler(async (req, res) => {
  const { name, comment, deadline, status } = req.body;

  try {
    const user = await User.findOne({ _id: req.user._id });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      throw new Error("User not found");
    }

    const userTodos = await User.findById(req.user._id)
      .select("todos")
      .populate("todos");
    const todoExists = userTodos.todos.find((todo) => todo.name === name);

    if (todoExists !== undefined) {
      res.status(404).json({ message: "Todo with this name already exists" });
      throw new Error("Todo with this name already exists");
    } else {
      const todo = await Todo.create({
        name,
        comment,
        deadline,
        status,
      });

      user.todos.push(todo);

      await user.save();

      res.status(201).json(todo);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
    throw new Error("Something went wrong");
  }
});

export const getTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  res.json(todo);
});

export const getTodos = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword && [
    { name: { $regex: req.query.keyword, $options: "i" } },
    { comment: { $regex: req.query.keyword, $options: "i" } },
  ];
  let todos = null;

  if (keyword) {
    todos = await User.findById(req.user._id)
      .select("todos")
      .populate({
        path: "todos",
        match: {
          $or: [...keyword],
        },
      });
  } else {
    todos = await User.findById(req.user._id).select("todos").populate("todos");
  }

  todos.todos.reverse();
  if (todos) {
    res.json(todos);
  } else {
    res.status(404).json({ message: "Todos not found" });
    throw new Error("Todos not found");
  }
});

export const editTodo = asyncHandler(async (req, res) => {
  const { name, comment, deadline, status } = req.body;

  const todo = await Todo.findById(req.params.id);

  if (todo) {
    todo.name = name || todo.name;
    todo.comment = comment || todo.comment;
    todo.deadline = deadline || todo.deadline;
    todo.status = status || todo.status;

    const updatedTodo = await todo.save();

    res.json(updatedTodo);
  } else {
    res.status(404).json({ message: "Todo not found" });
    throw new Error("Todo not found");
  }
});

export const markAsDoneTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.body._id);

  if (todo) {
    todo.status = 1;

    const updatedTodo = await todo.save();

    res.json(updatedTodo);
  } else {
    res.status(404).json({ message: "Todo not found" });
    throw new Error("Todo not found");
  }
});

export const deleteTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findByIdAndDelete(req.params.id);

  if (todo) {
    res.json(todo);
  } else {
    res.status(404).json({ message: "Todo not found" });
    throw new Error("Todo not found");
  }
});
