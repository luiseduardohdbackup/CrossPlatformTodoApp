
module.exports = function todoRoutes(todoAPI, mongoExpressAuth, app){

    checkLoggedInForAllTodoRoutes(mongoExpressAuth, app);

    app.get('/todo', function(req, res){
        var username = mongoExpressAuth.getUsername(req);
        todoAPI.getAll(username, makeSendResult(res));
    });

    app.get('/todo/:_id', function(req, res){
        var username = mongoExpressAuth.getUsername(req);
        var _id = req.params._id;
        todoAPI.get(username, _id, makeSendResult(res));
    });

    app.post('/todo', function(req, res){
        var content = req.body.content;
        var username = mongoExpressAuth.getUsername(req);
        todoAPI.create(username, content, makeSendResult(res));
    });

    app.put('/todo/:_id', function(req, res){
        var username = mongoExpressAuth.getUsername(req);
        var _id = req.params._id;
        var content = req.body.content;
        todoAPI.update(username, _id, content, makeSendResult(res));
    });

    app.delete('/todo', function(req, res){
        var username = mongoExpressAuth.getUsername(req);
        todoAPI.deleteAll(username, makeSendResult(res));
    });

    app.delete('/todo/:_id', function(req, res){
        var username = mongoExpressAuth.getUsername(req);
        var _id = req.params._id;
        todoAPI.delete(username, _id, makeSendResult(res));
    });
}

function checkLoggedInForAllTodoRoutes(mongoExpressAuth, app){
    app.all('/todo', function(req, res, next){
        mongoExpressAuth.checkLogin(req, res, function(err){
            if (err)
                res.send({ 'err': err });
            else
                next();
        });
    });
}

function makeSendResult(res){
    return function(err, result){
        if (typeof result === 'number')
            result = String(result);
        if (err)
            res.send({ 'err': 'unknown err' });
        else
            res.send(result);
    }
}
