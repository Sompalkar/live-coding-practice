

import {Router } from 'express'
import { createTodo,    deleteTodo,    getTodos, updateTodo } from '../controller/todo.controller.js';
import validate from '../validation/validate.js'
import { createTodoSchema } from '../validation/todo.schema.js'

const router = Router();  



router.post("/createTodo", validate(createTodoSchema), createTodo)
router.post("/Alltodos", getTodos);
router.put('/updateTodo', updateTodo);
router.delete('/deleteTodo', deleteTodo);

    


export default router;