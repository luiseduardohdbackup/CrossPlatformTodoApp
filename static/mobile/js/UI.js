
//config:
//  {
//      events: {
//          refresh: () => void
//          create: (content) => void
//          delete: (_id) => void
//      }
//  }
var UI = function(config){

    this.events = config.events;

    this.initDom();
    this.dom.overlay.removeClass('initiallyHidden');
    this.dom.overlay.hide();

    this.dom.deleteButton.removeClass('initiallyHidden');
    this.dom.deleteButton.detach();
    this.dom.deleteButton.onButtonTap(this.deleteCurrent.bind(this));

    this.dom.createTodoButton.onButtonTap(this.showCreateTodoOverlay.bind(this));
    this.dom.createTodoContentCancelButton.onButtonTap(this.cancelCreateTodoOverlay.bind(this));

    this.dom.createTodoContentOkButton.onButtonTap(this.okCreateTodoOverlay.bind(this));


    window.LogoutManager.setHangleLogoutResult(function(){
        this.emptyTodos();
        this.showOverlay(this.dom.loginOverlay);
    }.bind(this));

    window.LoginManager.setLoginSuccess(function(){
        this.hideOverlay(this.dom.loginOverlay);
        this.dom.usernameInput.val('');
        this.dom.passwordInput.val('');
        this.events.refresh();
    }.bind(this));

    if(!window.TodoAPI.isLoggedIn()){
        this.showOverlay(this.dom.loginOverlay);
    }
}

UI.prototype = {
    initDom: function(){
        this.dom = {
            todos: $('#todos'),
            overlay: $('.overlay'),
            page: $('.page'),
            createTodoButton: $('#createTodoButton'),
            createTodoOverlay: $('#createTodoOverlay'),
            createTodoContentInput: $('#createTodoContentInput'),
            createTodoContentOkButton: $('#createTodoContentOkButton'),
            createTodoContentCancelButton: $('#createTodoContentCancelButton'),
            loginOverlay: $('#loginOverlay'),
            usernameInput: $('#usernameInput'),
            passwordInput: $('#passwordInput'),
            deleteButton: $('#deleteButton')
        }

        this.dom.createTodoOverlay.removeClass('initiallyHidden');
        this.dom.createTodoOverlay.detach();

        this.dom.loginOverlay.removeClass('initiallyHidden');
        this.dom.loginOverlay.detach();

    },

    showOverlay: function(overlay){
        this.dom.overlay.show();
        this.dom.overlay.append(overlay);
        this.dom.page.css('overflow', 'hidden');
    },

    hideOverlay: function(overlay){
        this.dom.overlay.hide();
        overlay.detach();
        this.dom.page.css('overflow', 'auto');
    },

    showCreateTodoOverlay: function(){
        this.showOverlay(this.dom.createTodoOverlay);
    },

    okCreateTodoOverlay: function(){
        var content = this.dom.createTodoContentInput.val();
        this.dom.createTodoContentInput.val('');

        this.events.create(content);

        this.hideOverlay(this.dom.createTodoOverlay);
    },

    cancelCreateTodoOverlay: function(){
        this.dom.createTodoContentInput.val('');
        this.hideOverlay(this.dom.createTodoOverlay);
    },

    deleteCurrent: function(){
        var currentTodo = $('.currentTodo');
        var _id = currentTodo.data('_id');
        this.events.delete(_id);
    },

    //==================
    //  API
    //==================

    emptyTodos: function(){
        this.dom.todos.empty();
    },

    insert: function(todo){
        var domContent = $('<div>');
        domContent.text(todo.content);
        domContent.addClass('todoContent')

        var domTodo = $('<li>');
        domTodo.data('_id', todo._id);
        domTodo.addClass('todo');
        domTodo.append(domContent);
        
        this.dom.todos.prepend(domTodo);

        domTodo.ontap(null, null, function(){
            $('.currentTodo').removeClass('currentTodo');
            domTodo.addClass('currentTodo');
            this.dom.deleteButton.detach();
            domTodo.append(this.dom.deleteButton);
        }.bind(this));
    },

    remove: function(_id){
        this.dom.todos.children().each(function(){
            var todo = $(this);
            if (todo.data('_id') === _id){
                todo.find('#deleteButton').detach();
                todo.remove();
            }
        });
    }

}
