

var g = {
    mongoClient: null,
    mongoCollection: null
}

exports.init = function(done){
    initMongo(done);
}

exports.getAll = function(username, done){
    g.mongoCollection.find({ username: username }, { content: 1, _id: 1 }).toArray(done);
}

exports.get = function(username, _id, done){
    g.mongoCollection.findOne({ username: username, _id: new mongo.ObjectID(_id) }, { content: 1, _id: 1 }, done);
}

exports.create = function(username, content, done){
    g.mongoCollection.insert(
        {    
            username: username,
            content: content
        },
        function(err, result){
            if (err)
                done(err, null);
            else
                done(null, result[0]._id);
        }
    );
}

exports.update = function(username, _id, content, done){
    g.mongoCollection.find(
        { 
            username: username,
            _id: new mongo.ObjectID(_id)
        },
        {
            $set: {
                content: content
            }
        },
        { 
            multi: true 
        },
        done
    );
}

exports.deleteAll = function(username, done){
    g.mongoCollection.remove({ 'username': username }, done);
}

exports.delete = function(username, _id, done){
    g.mongoCollection.remove({ 'username': username, _id: new mongo.ObjectID(_id) }, done);
}

//===========================
//  MONGO INIT
//===========================

var mongo = require('mongodb');

var mongoConfig = {
    host: global.mongoConfig.host,
    port: global.mongoConfig.port,
    dbName: global.mongoConfig.dbName,
    collectionName: 'todos'
};

function initMongo(done){

    var host = mongoConfig.host;
    var port = mongoConfig.port;

    var optionsWithEnableWriteAccess = { w: 1 };

    g.mongoClient = new mongo.Db(
        mongoConfig.dbName,
        new mongo.Server(host, port),
        optionsWithEnableWriteAccess
    );

    openCollection(mongoConfig.collectionName, done);
}

function openCollection(collectionName, done){
    g.mongoClient.open(onDbReady);

    function onDbReady(error){
        if (error)
            done(error)

        g.mongoClient.collection(collectionName, onCollectionReady);
    }

    function onCollectionReady(error, collection){
        if (error)
            done(error)

        g.mongoCollection = collection;

        done();
    }
}
