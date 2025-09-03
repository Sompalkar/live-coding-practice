

import { Schema, model, Types } from "mongoose"


 

 
const todo = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId as unknown as Types.ObjectId,
      ref: "user",
      required: true,
    },
    userName: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },
  },
  { timestamps: true }
)

const Todo = model("Todo", todo);

export default Todo;