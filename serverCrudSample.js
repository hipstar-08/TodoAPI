var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('db.js');

var app = express();
var PORT = process.env.ROOT || 4000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());
app.get('/', function (req, res) {
  res.send('Todo API root');
});

app.get('/', function (req, res) {
  // res.send(todos)
  res.json(todos);
});

app.get('/todos', function (req, res) {
  var queryParams = req.query;
  var filteredTodos = todos;

  if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
      filteredTodos = _.where(filteredTodos, {completed: true});
  } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
      filteredTodos = _.where(filteredTodos, {completed: false});
  }

  if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
    filteredTodos = _.filter(filteredTodos, function(todo) {
      return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
    });
  }
  // else {
  //   res.status(404).json({"error": "No item found as per query"});
  // }
  res.json(filteredTodos);
});

app.get('/todos/:id', function (req, res) {
  // res.json(todos);
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId});
  if (matchedTodo) {
      res.json(matchedTodo);
  } else {
    res.status(404).send();
  }
  res.send('Asking for todo id of ' + req.params.id)
});

app.post('/todos', function (req, res){
  // var body = req.body;
  var body = _.pick(req.body, 'description', 'completed');
  if (!_.isBoolean(body.completed) || !_.isString(body.description || body.description.trim().length === 0 )) {
    return res.status(400).send();
  }
  body.description = body.description.trim();
  body.id = todoNextId++;
  todos.push(body);
  res.json(body);
});

app.delete('/todos/:id', function (req, res) {
  // res.json(todos);
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId});
  if (matchedTodo) {
      todos = _.without(todos, matchedTodo);
      res.json(matchedTodo);
      res.status(200).send();
  } else {
    res.status(404).json({"error": "No Id found to be deleted"});
  }
  res.send('Asking for todo id of ' + req.params.id)
});

app.put('/todos/:id', function (req, res){
  // var body = req.body;

  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId});
  var body = _.pick(req.body, 'description', 'completed');
  var validAttributes = {};

  if(!matchedTodo) {
    return res.status(404).json({"error": "Not matched TODO, Hmm somethings wrong"});
  }
  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
    validAttributes.completed =  body.completed;
  } else  if (body.hasOwnProperty('completed')) {
    return res.status(404).json({"error": "Hmm somethings wrong"});
  }

  if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
    validAttributes.description = body.description;
  } else if (body.hasOwnProperty('description')) {
    return res.status(400).send();
  }
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});

    _.extend(matchedTodo, validAttributes);
    res.json(matchedTodo)
});

db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    console.log('Express on Port: '+ PORT);
});
});
