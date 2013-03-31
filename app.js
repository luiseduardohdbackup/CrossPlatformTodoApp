
var mongo = require('mongodb');
var useragent = require('express-useragent');

global.mongoConfig = {
    host: 'localhost',
    port: mongo.Connection.DEFAULT_PORT,
    dbName: 'todo'
}

var express = require("express");
var app = express();

var mongoExpressAuth = require('mongo-express-auth');

var todoAPI = require('./todoAPI.js');

mongoExpressAuth.init({
    mongo: { 
        host: global.mongoConfig.host,
        port: global.mongoConfig.port,
        dbName: global.mongoConfig.dbName,
        collectionName: 'accounts'
    }
}, function(){
    todoAPI.init(function(){
        console.log('ready on port 3000');
        app.listen(3000);
    });
});

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(useragent.express());
app.use(express.session({ secret: 'ntynt23@#n4nknayw#2100bh' }));

//==================
//      routes
//==================

require('./loginRoutes.js')(mongoExpressAuth, app);
require('./todoRoutes.js')(todoAPI, mongoExpressAuth, app);

app.all('/', function mobileDesktopRouter(req, res, next){
    if (!strStartsWith(req.url, '/desktop') && !strStartsWith(req.url, '/mobile')){
        if (req.useragent.isMobile){
            wwwExists('static/mobile' + req.url, function(exists){
                if (exists)
                    req.url = '/mobile' + req.url;
                next();
            });
        }
        else {
            wwwExists('static/desktop' + req.url, function(exists){
                if (exists)
                    req.url = '/desktop' + req.url;
                next();
            });
        }
    }
    else {
        next();
    }
});

app.get('/', function(req, res, next){
    mongoExpressAuth.checkLogin(req, res, function(err){
        if (err)
            res.sendfile('static/login.html');
        else
            next();
    });
});

app.use('/', express.static(__dirname + '/static/'));

//==================
//      helpers
//==================

var fs = require('fs');
function wwwExists(url, done){
    if (strEndsWith(url, '/'))
        url += 'index.html';
    fs.exists(url, done);
}

function strStartsWith(str, prefix) {
    return str.indexOf(prefix) === 0;
}

function strEndsWith(str, suffix) {
    return str.match(suffix + "$") == suffix;
}
