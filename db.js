const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const bcrypt = require('bcrypt');
 
const url = process.env.MONGOURI || 'mongodb://localhost:27017';
const dbName = 'etn';

function register(u,p,callback){
    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        let users = db.collection("users");
        let notepads = db.collection("notepads");
        let todos = db.collection("todos");
        if(u.length < 4)return callback(false);
        if(p.length < 8)return callback(false);
        users.findOne({u:u},function(err,res){
            if(res === null){
                let hash = bcrypt.hashSync(p, bcrypt.genSaltSync(16));
                users.insertOne({u:u,p:hash});
                notepads.insertOne({owner:u,notepad:"Write anything here"});
                todos.insertOne({owner:u,todo:["Water the plants", "Read a book", "Hydrate yourself"]});
                client.close();
                callback(true);
            }else{
                client.close();
                callback(false);
            }
        });
    });
}

function login(u,p,callback){
    MongoClient.connect(url, async function(err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        let users = db.collection("users")
        users.findOne({u:u},async function(err,res){
            client.close();
            if(res == null){
                callback(false);
            }else{
                await bcrypt.compare(p,res.p,function(err,same){
                    callback(same);
                });
            }
        });
    });
}

function getPad(u,callback){
    MongoClient.connect(url, async function(err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        let notepads = db.collection("notepads")
        notepads.findOne({owner:u},async function(err,res){
            client.close();
            if(res == null){
                callback("");
            }else{
                callback(decodeURIComponent(res.notepad));
            }
        });
    });
}

function getTodo(u,callback){
    MongoClient.connect(url, async function(err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        let todos = db.collection("todos")
        todos.findOne({owner:u},async function(err,res){
            client.close();
            if(res == null){
                callback([]);
            }else{
                callback(res.todo);
            }
        });
    });
}

function updatePad(o){
    MongoClient.connect(url, async function(err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        let notepads = db.collection("notepads");
        notepads.findOneAndUpdate({owner:o.u}, {$set: {notepad: o.contents}});
    });
}

function updateTodo(o){
    MongoClient.connect(url, async function(err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        let todos = db.collection("todos")
        todos.findOneAndUpdate({owner:o.u}, {$set: {todo: o.t}});
    });
}

module.exports = {
    register: register,
    login: login,
    getPad: getPad,
    getTodo: getTodo,
    updatePad: updatePad,
    updateTodo: updateTodo
}