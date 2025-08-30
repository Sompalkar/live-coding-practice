

import { Schema, model } from "mongoose"


 

 
const todo = new Schema({
      id:Schema.Types.ObjectId,
      title: String,
      completed: Boolean,
      createdAt: Date,
      updatedAt: Date,
      userId: Number,
      userName: String,

})

const Todo = model("Todo", todo);

export default Todo;