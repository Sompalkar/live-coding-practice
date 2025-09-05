

import {Router } from 'express'
import { createTodo,    deleteTodo,    getTodos, updateTodo, editTodo } from '../controller/todo.controller.js';
import validate from '../validation/validate.js'
import { createTodoSchema, editTodoSchema } from '../validation/todo.schema.js'

const router = Router();  



router.post("/createTodo", validate(createTodoSchema), createTodo)
router.post("/Alltodos", getTodos);
router.put('/updateTodo', updateTodo);
router.put('/editTodo', validate(editTodoSchema), editTodo);
router.delete('/deleteTodo', deleteTodo);

    


export default router;