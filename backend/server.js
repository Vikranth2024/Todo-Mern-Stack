const express = require("express");
const app = express(); // instance of express
const mongoose = require("mongoose");
const cors = require('cors')
require("dotenv").config()

app.use(express.json());
app.use(cors())



// connecting to MongoDB
mongoose
  .connect(process.env.URL)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(err);
  });



// creating schema
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true,unique:true },
  description: { type: String, required: true, unique: true },
});



// creating model
const todoModel = mongoose.model("Todo", todoSchema);





// Create a new todo item, POST request
app.post("/todos", async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTodo = new todoModel({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});





// Get all items
app.get("/todos", async (req, res) => {
  try {
    const todos = await todoModel.find();
    res.json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});





//update Todo item
app.put("/todos/:id",async (req,res)=>{
    try{
        const {title, description} = req.body
    const itemid = req.params.id
    const updatedTodo = await todoModel.findByIdAndUpdate(
        itemid,
        {title , description},{new : true}
    )
    if (!updatedTodo){
        return res.status(404).json({message : "Todo not found"})
    }
    res.json(updatedTodo)

    }catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
      }
})





//delete a todo item
app.delete('/todos/:id',async (req,res)=>{
    try{
        const id = req.params.id
    await todoModel.findByIdAndDelete(id)
    res.status(204).end()
    }catch (err) {
        console.log(err.message, err)
        res.status(500).json({ message: error.message });
    }
    
})



// start the server
const PORT = 8030;
app.listen(PORT, () => {
  console.log("Server is listening on port", PORT);
});