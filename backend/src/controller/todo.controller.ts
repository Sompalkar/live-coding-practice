import type { Request, Response } from "express";
import Todo from "../models/todo.model.js";

export const getTodos= async (  req :Request, res :Response )=>{

             try {
                

                 const allTodos= await Todo.find();

                 res.status(200).json({
                    message:"Todos fetched successfully",
                    data: allTodos
                 })

             } catch (error) {  
                res.status(500).json({
                    message:"Todos fetching failed",
                    error: error
                })
             }


}




export const createTodo = async ( req: Request, res: Response )=>{


    const { title , completed } = req.body;
    const { userId } = req.body;
    console.log(title, completed, userId);
        try {
            
            const newTodo=  await Todo.create({ title, completed })

            res.status(201).json({
                message:"Todo created successfully",
                data: newTodo 
            })


        } catch (error) {
            res.status(500).json({
                message:"Todo creation failed",
                error: error
            })
        }


    }




    export const updateTodo = async ( req: Request , res: Response)=>{
        const { _id}= req.body;
        console.log(_id);           
        try {
            const updatedTodo = await Todo.findByIdAndUpdate(_id, {completed:true}, {new:true})
                console.log(updatedTodo);           
            res.status(200).json({                  
                message:"Todo updated successfully",
                data: updatedTodo   
            })
            
        } catch (error) {
            res.status(500).json({
            message:"Todo updating failed", 
            error: error
        })
    }

 }


 export const deleteTodo = async (req:Request , res: Response)=>{


          const { _id} = req.body;

          try {
  
             const response= await Todo.findByIdAndDelete(_id);

             res.status(200).json({
                message:"Todo deleted successfully",
                data:response
            
            }
             )


          } catch (error) {
            res.status(500).json({  
                message:"Todo deleting failed",
                error: error
            })
            
          }
 }