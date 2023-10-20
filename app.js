const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("app/public"));

app.set("view engine", "ejs");
app.set("views", "./app/views");

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

//Uso do express-session

const session = require('express-session')

app.use(session({
    secret: 'seuSegredo',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

/*---------*/

var rotas = require("./app/routes/router");
app.use("/", rotas);

app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
});
