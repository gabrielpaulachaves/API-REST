//npm init -y
//npm install --save express
//npm install nodemon -g
//npm install --save mongoose

//além de GET e POST, existem os : PUT, PATCH, DELETE
//get - busca informacao
//post - envia para o banco de dados
//put - serve mara modificar informacao
//delete - deleta
//patch - modifica uma parte da informacao e nao ela inteira

const express = require("express")
const app = express()
require("./config/db")
const mongoose = require("mongoose")
require("./models/livros")
require("./models/categoria")
const livros = require("./routes/livro")
const categoria = require("./routes/categoria")

//navegador se usa urlencoded {extended: true}, o resto (como inmsonia usa express.json())
app.use(express.json()) //transforma a requisicao que está em JSON em objeto JS, interpreta envio de dados em formato JSON

app.use("/livros", livros)
app.use("/categorias", categoria)

//a logica é: ouça essa porta e execute essa funcao
const port = 3333
app.listen(port, ()=>{
    console.log('Servidor aberto')
})

