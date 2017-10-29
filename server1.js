var express = require('express');
var app = express();
var PORT = process.env.ROOT || 4000;
var todos = [{
    id: 1,
    description: 'Shifting tomorrow to new home, will work at Amazon and play at Kerala Blasters',
    completed: false
}, {
    id: 2,
    description: 'You will be at Amazon and play at Kerala Tuskers',
    completed: false
},  {
    id: 3,
    description: 'Sony you will be succesful at Amazon + Kerala Blasters',
    completed: true
}];

app.get('/', function (req, res) {
  res.send('Todo API root');
});

app.get('/todos', function (req, res) {
  // res.send(todos)
  res.json(todos);
});

app.get('/todos/:id', function (req, res) {
  // res.json(todos);
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo;

  todos.forEach(function (todo) {
    if (todoId === todo.id) {
      matchedTodo = todo;
    }
  });
  if (matchedTodo) {
      res.json(matchedTodo);
  } else {
    res.status(404).send();
  }
  res.send('Asking for todo id of ' + req.params.id)
});

app.listen(PORT, function () {
  console.log('Express on Port: '+ PORT);
});
