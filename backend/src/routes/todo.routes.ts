

import {Router } from 'express'
import { createTodo,    deleteTodo,    getTodos, updateTodo } from '../controller/todo.controller.js';

const router = Router();



router.post("/createTodo",createTodo)
router.get("/Alltodos", getTodos);
router.put('/updateTodo', updateTodo);
router.delete('/deleteTodo', deleteTodo);

    


export default router;