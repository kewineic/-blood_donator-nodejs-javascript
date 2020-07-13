const express = require ("express");
const app = express();
const nunjucks = require("nunjucks");

app.use(express.static('public'));

app.use(express.urlencoded({extended: true}));

nunjucks.configure("./", {
    express: app,
    noCache: true,
});

const Pool = require('pg').Pool;
const db = new Pool({
    user:'postgres',
    password:'0000',
    host:'localhost',
    port: 5432,
    database:'doe'
});

app.get("/", function(req, res){
    db.query("SELECT * FROM doadores", function(err, result){ 
        if (err){return res.send("Erro de banco de dados.")}

        const doadores = result.rows;
        return res.render("index.html", {doadores})
    });
});

app.post("/", function(req, res){
    const name = req.body.name;
    const email = req.body.email;
    const sangue = req.body.sangue;

    if (name == "" || email== "" || sangue == ""){
        return res.send("Todos os campos sao obrigatórios.")
    }

    const query = 
    `INSERT INTO doadores ("name", "email", "sangue") 
    VALUES($1, $2, $3)`;

    const values = [name, email, sangue];

    db.query(query, values, function (err) {
        if (err) {return res.send("Erro no banco de dados.")}
        return res.redirect("/")
    });
});

app.listen(3000, function(){
    console.log("Iniciei o servidor!!");
});