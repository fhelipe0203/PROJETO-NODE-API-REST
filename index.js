//Projeto de Octavio Fhelipe Uriel Cavalcante
const express = require('express')
const { Sequelize, DataTypes, cast, where } = require('sequelize')
const Task = require('./models/task')

const app = express()
const sequelize = new Sequelize({ dialect: 'sqlite', storage: './task-list.db' })
const tasks = Task(sequelize, DataTypes)

// We need to parse JSON coming from requests
app.use(express.json())

// List tasks listamos a tasks
app.get('/tasks', async(req, res) => {
try{ 
 const allTasks = await tasks.findAll()
 res.status(200).json({allTasks})
}
catch (error){ 
res.status(500).json({error: error + "Error servidor"})
}
});

// Create task criamos tasks
app.post('/tasks', async (req, res,) => {
  const{description,done}= req.body
 const novaTask= await tasks.findOne({description:description,done:done})
 if(novaTask === null){
  return res.status(400).json({error: "tarefa ja no sistema"})}
  try{
    const cadastrarTask= await tasks.create({description:description,done:done})
     res.status(200).json(cadastrarTask)
  } 
  catch(error){
    res.status(500).json({message:error.message})
  }
});

// Show task procuramos por id
app.get('/tasks/:id', async(req, res) => {
  const taskId= req.params.id
  try{
    const infoTask= await tasks.findOne({where:{id:taskId}})
    if(!infoTask){
      res.status(400).json({message:"já existe essa Task"})
      return
    }
    res.status(200).json({infoTask})
  }
  catch(error){
    res.status(500).json({error:error})
  }
});

// Update task atualizamos tasks
app.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  const description= req.body.description
  const done = req.body.done
  try {
    const task= await tasks.findByPk(taskId)
    task.update({description:description,done:done})
    res.json({taskId: 'atualizado'})
  }
  catch(error){
    res.status(500).json({error: error})
  }
});

// Delete task deletamos
app.delete('/tasks/:id', async(req, res) => {
  const taskId = req.params.id
   try{
    const deletTask= await tasks.destroy({where:{id:taskId}})
    res.json({taskId:"Excluida"})
   }
   catch(error){
    res.status(500).json({error: error})
  }
})
// Nota quando deletamos pelo id criamos e id é automatico ou sejá não temos req para fazer post com id especifico
//Em resume depois de apagar não vamos ter esse id nem essa tasks

app.listen(3000, () => {
  console.log('Iniciando o ExpressJS na porta 3000')
})
