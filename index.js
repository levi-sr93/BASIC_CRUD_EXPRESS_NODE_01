const express = require('express');

const server = express();

server.use(express.json());

//localhost:3000/test

//Tipos de parametros
//Query params = ?teste=1
//Route Params = /users/1
//Request Body = { "name": 'Levi, "email":"meuemail@meuemail.com" }

// crud - create, read, Update, Delete

const users = ['Levi', 'Davi Santos', 'Samuel'];

//middleware global
server.use((req, res, next) => {
  console.time('Request');
  console.log(`Método ${req.method} ; URL ${req.url}`);

  next();

  console.timeEnd('Request');

  console.log('Finalizou');
})

//Middleware para ser usado de forma local na rota
function checkUsersExists(req, res, next) {
  if(!req.body.name) {
    return res.status(400).json({error: 'User name is required'})
  }

  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index]

  if(!user){
    return res.status(400).json({error: 'User does not exists'})
  }

  req.user = user;

  return next();
}

//GEtting all users
server.get('/', (req, res) => {
  return res.json(users)
})

//Getting one user only based on the array index
server.get('/users/:index', checkUserInArray, (req, res) => {
  return res.json(req.user)
});

//Creating a user
server.post('/users', checkUsersExists, (req, res) => {
  const {name} = req.body;

  users.push(name);
  return res.json(users);
})

//Editing a Users
server.put('/users/:index', checkUserInArray, checkUsersExists, (req, res) => {
  const {index} = req.params;
  const {name} = req.body;

  users[index] = name;
  return res.json(users);
})

//Excluding Users
server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;
  
  users.splice(index, 1);
  
  return res.json(users);
})

server.listen(3000);