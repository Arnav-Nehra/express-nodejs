/* 
   This express server stores the todo-list inside the memory in a json file,even if the   
   connection breaks down the data will remain intact inside a file, unlike the previous
   version of the same todo which stored inside an array this is different.
*/


// tried and tested works perfect.





const fs=require('fs')
const express=require('express')
const app =express()
const port=3000
const path=require('path')
const bodyparser=require('body-parser')

function find(arrr,id){
    for(let i=0;i<arrr.length;i++){
        if(parseInt(arrr[i].id) === id){
            return i;
        }
    }
    return -1;
}
function removeAtIndex(arr, index) {
    let newArray = [];
    for (let i = 0; i < arr.length; i++) {
      if (i !== index) newArray.push(arr[i]);
    }
    return newArray;
  }
app.use(bodyparser.json())

app.get('/todos',(req,res)=>{
    fs.readFile(path.join(__dirname,'/todos.json'),function(err,data){
        if(err) throw err 
        res.json(JSON.parse(data))
    })
})

app.get('/todos/:id',(req,res)=>{
    fs.readFile(path.join(__dirname,'todos.json'),function(err,data){
        if(err) throw err;
        const todos=JSON.parse(data)
        const todosIndex=find(todos,parseInt(req.params.id))
      
        if(todosIndex===-1){
            res.status(404).send()
        }
        res.json(todos[todosIndex])
    })
})

app.post('/todos', (req, res) => {
    const newTodo = {
        id: JSON.stringify(Math.floor(Math.random() * 10000000)),
        title: req.body.title,
        description: req.body.description
    };

    fs.readFile(path.join(__dirname, '/todos.json'), 'utf8', (err, data) => {
        if (err) throw err;
        let todos = JSON.parse(data)
        todos.push(newTodo);

        fs.writeFile(path.join(__dirname, '/todos.json'), JSON.stringify(todos, null, 2), (err) => {
            if (err) throw err;
            res.status(200).send();
        });
    });
});
app.put('/todos/:id',(req,res)=>{
    const updatedTodo={
        id:req.params.id,
        title:req.body.title,
        description:req.body.description
    }
        fs.readFile(path.join(__dirname,'todos.json'),function(err,data){
        if(err) throw err;
        const todos=JSON.parse(data)
        const todosIndex=find(todos,parseInt(req.params.id))
        if(todosIndex===-1){
            res.status(404).send()
        }
        todos[todosIndex]=updatedTodo
        fs.writeFile(path.join(__dirname, '/todos.json'), JSON.stringify(todos, null, 2), (err) => {
            if (err) throw err;
            res.status(200).json(updatedTodo);
        });
    })
     
    })

app.delete('/todos/:id',(req,res)=>{
    fs.readFile(path.join(__dirname,'/todos.json'),(err,data)=>{
        if(err) throw err
            let todos=JSON.parse(data)
            let todosIndex=find(todos,parseInt(req.params.id))
            if(todosIndex===-1){
                res.status(404).send()
            }
            todos=removeAtIndex(todos,todosIndex)
            fs.writeFile(path.join(__dirname,'/todos.json'),JSON.stringify(todos),(err)=>{
            if(err) throw err
            res.status(200).json("deleted")
        })
    })
}
)


app.listen(port)
