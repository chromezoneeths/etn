const express = require("express");
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const pug = require("pug");
const { login, register, getPad, getTodo, updatePad, updateTodo } = require("./db.js")
require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(session({
	secret: process.env.SESSIONSECRET,
	resave: true,
	saveUninitialized: true
}));

app.get("/", (req,res) => {
    if(req.session.loggedin){
        getPad(req.session.u, function(pad){
            getTodo(req.session.u, function(todo){
                res.send(pug.renderFile("public/home.pug", {
                    u: req.session.u,
                    n: pad,
                    t: todo
                }));
            });
        });
    }else{
        res.redirect("/signup");
    }
});

app.get("/signin", (req,res) => {
    res.send(pug.renderFile("public/signin.pug"));
});

app.get("/signout", (req,res) => {
    if(req.session.loggedin){
        req.session.destroy();
    }
    res.redirect("/");
});

app.get("/signup", (req,res) => {
    res.send(pug.renderFile("public/signup.pug"));
});

app.post("/signin", async (req,res) => {
    let u = req.body.username;
    let p = req.body.password;
    if(u&&p){
        login(u,p,function(success){
            if(success){
                req.session.loggedin = true;
                req.session.u = u;
                res.redirect("/");
            }else{
                res.send(pug.renderFile("public/signin.pug", {
                    fail: true
                }));
            }
        });
    }
});

app.post("/signup", async (req,res) => {
    let u = req.body.username;
    let p = req.body.password;
    let p2 = req.body.password2;
    if(u&&p&&p2){
        if(p!=p2){
            return res.send(pug.renderFile("public/signup.pug", {
                fail: true
            }));
        }
        register(u,p,function(success){
            if(success){
                req.session.loggedin = true;
                req.session.u = u;
                res.redirect("/");
            }else{
                res.send(pug.renderFile("public/signin.pug", {
                    fail: true
                }));
            }
        });
    }
});

app.post("/updatenotepad", (req,res) => {
    updatePad(req.body);
    res.status(204).end()
});

app.post("/updatetodo", (req,res) => {
    updateTodo(req.body);
    res.status(204).end()
});

app.listen(8080); // change to 80