
(function(){
    window.TodoAPI = {
        getAll: function(done){
            var request = $.ajax({ type: "get", url: "/todo"});
            setupCallback(request, done);
        },

        get: function(id, done){
            var request = $.ajax({ type: "get", url: "/todo/" + id});
            setupCallback(request, done);
        },

        create: function(content, done){
            var request = $.ajax({ 
                type: "post", 
                url: "/todo",
                data: { content: content }
            });
            setupCallback(request, done);
        },

        update: function(id, content, done){
            var request = $.ajax({ 
                type: "put", 
                url: "/todo/" + id,
                data: { content: content }
            });
            setupCallback(request, done);
        },

        deleteAll: function(done){
            var request = $.ajax({ type: "delete", url: "/todo"});
            setupCallback(request, done);
        },

        delete: function(id, done){
            var request = $.ajax({ type: "delete", url: "/todo/" + id });
            setupCallback(request, done);
        },

        isLoggedIn: function(){
            var cookies = document.cookie.split('; ');
            for (var i = 0; i < cookies.length; i++){
                var key = cookies[i].substring(0, cookies[i].indexOf('='));
                var value = cookies[i].substring(cookies[i].indexOf('=')+1);
                if (key === 'username')
                    return true;
            }
            return false;
        }
    }

    function setupCallback(request, done){
        request.done(function(data) {
            if (data.err !== undefined)
                done(data.err, null);
            else
                done(null, data);
        });
        request.fail(function(jqXHR, textStatus, err){
            done(err, null);
        });
    }
})();
