var TodoApp = function(){

    this.todos = [];

    this.ui = new UI({
        events: {
            refresh: this.refresh.bind(this),
            create: this.createTodo.bind(this),
            delete: this.deleteTodo.bind(this)
        }
    });

    this.refresh();
}

TodoApp.prototype = {
    refresh: function(){
        window.TodoAPI.getAll(this.gotAll.bind(this));
    },
    gotAll: function(err, todos){
        if (err)
            throw err;
        this.ui.emptyTodos();
        this.todos = [];
        for (var i = 0; i < todos.length; i++){
            this.insert(todos[i]);
        }
    },
    insert: function(todo){
        this.ui.insert(todo);
        this.todos.push(todo);
    },
    createTodo: function(content){
        window.TodoAPI.create(content, function(err, _id){
            if (err)
                throw err;
            var newTodo = {
                content: content,
                _id: _id
            }
            this.insert(newTodo);
        }.bind(this));
    },
    deleteTodo: function(_id){
        window.TodoAPI.delete(_id, function(err, result){
            if (err)
                throw err;
            this.ui.remove(_id);
        }.bind(this));
    }
}
