const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var port = process.env.PORT || 3000;

// setting view engine globally //
app.set('view engine', 'ejs');
app.set('views' , __dirname + '/views');

// body parser middleware // 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// serving static files //
app.use('/public', express.static('public'));

// global variable for error handling
app.use(function(req, res, next){
    res.locals.errors = null;
    next();
})

// express validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

var todos = [];

app.get('/', function(req, res){
    todos = [];
    res.render('todolist.ejs', {
        todos: todos
    })
})

app.post('/', function(req, res){

    req.checkBody('todo', 'please enter a task').notEmpty();

    var errors = req.validationErrors();

    if(errors){
        console.log('error found')
        res.render('todolist.ejs', {
        todos: todos,
        errors: errors
    })
    }

    else{
        console.log('success');
        todos.push(req.body.todo)
        console.log(req.body.todo + 'sdsd')
        res.render('todolist.ejs', {
        todos: todos
    })
    }

    
})

app.post('/delete', function(req, res){
    // console.log(req.body.index)
    todos.splice(req.body.index, 1);
    res.render('todolist.ejs', {
        todos: todos
    })
})

// app.get('*', function(req, res){
//     res.sendFile(__dirname + '/views/404.html')
// })


app.listen(port, function(){
    console.log('server is running on port 3000');
})