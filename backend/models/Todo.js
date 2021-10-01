import mongoose from "mongoose";

const todoSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String },
    deadline: { type: Date, required: true },
    status: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

todoSchema.pre("save", async function (next) {
  if (this.isModified("createdAt")) {
    this.createdAt = this.createdAt.getTime() + 4 * 60 * 60 * 1000;
    next();
  }
  this.deadline = this.deadline.getTime() + 4 * 60 * 60 * 1000;
  this.updatedAt = this.updatedAt.getTime() + 4 * 60 * 60 * 1000;
});

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
