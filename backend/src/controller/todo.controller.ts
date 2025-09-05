import { response, type Request, type Response } from "express";
import Todo from "../models/todo.model.js";

export const getTodos= async (  req :Request, res :Response )=>{


              const {userId}= req.body
            //   console.log("---------", req.body)

             try { 

                 if( !userId){
                    return res.status(400).json({ message :"userId is missing in the request body"})

                 }

                 const allTodos = await Todo.find({userId})

                 if(    allTodos.length === 0){
                    return res.status(404).json({ message :"No todos found for the user"})
                 }

                 return res.status(200).json({
                    success: true,
                    message:"Todos fetched successfully",
                    data: { todos: allTodos }
                 })


             } catch (error) {  
                return res.status(500).json({
                    message:"Todos fetching failed",
                    error: error
                })
             }


}




export const createTodo = async ( req: Request, res: Response )=>{


    const { title , completed = false, userId } = req.body || {};

    try {


         const newTodo = await Todo.create({ title: title.trim(), completed, userId });

         return res.status(201).json({
            success: true,
            message:"Todo created successfully",
            data: { todo: newTodo }
         })
        
    } catch (error: any) {
        const message = error?.message || 'Todo creation failed'
        res.status(500).json({ message })
    }


    }




    export const updateTodo = async ( req: Request , res: Response)=>{
        const { _id}= req.body;
        console.log(_id);           
        try {
            const updatedTodo = await Todo.findByIdAndUpdate(_id, {completed:true}, {new:true})
                console.log(updatedTodo);           
            return res.status(200).json({                  
                success: true,
                message:"Todo updated successfully",
                data: { todo: updatedTodo }   
            })
            
        } catch (error) {
            return res.status(500).json({
            message:"Todo updating failed", 
            error: error
        })
    }

 }

 export const editTodo = async (req: Request, res: Response) => {
    const { _id, title, completed, userId } = req.body;

    try {
        // Verify the todo belongs to the user
        const existingTodo = await Todo.findOne({ _id, userId });
        if (!existingTodo) {
            return res.status(404).json({
                message: "Todo not found or you don't have permission to edit this todo"
            });
        }

        // Update the todo
        const updatedTodo = await Todo.findByIdAndUpdate(
            _id,
            { 
                title: title.trim(),
                ...(completed !== undefined && { completed })
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Todo updated successfully",
            data: { todo: updatedTodo }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Todo updating failed",
            error: error
        });
    }
}




 export const deleteTodo = async (req:Request , res: Response)=>{


          const { todoId} = req.body;
        //   console.log(req.body)


        try {
            
            const response = await Todo.findByIdAndDelete({_id:todoId})

                console.log(response)


        
                return res.status(200).json({
                    success: true,
                    message:"Todo successfully deleted",
                    data: { deleted: true }
                })

        } catch (error) {

            return res.status(400).json({error, message:"Error deleting Todo..."})
            
        }
 
 
 
 }