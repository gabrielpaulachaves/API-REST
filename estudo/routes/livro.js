const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
require("../models/livros")
const livro = mongoose.model("livros")

router.get("/listagem", (req, res)=>{
    async function buscando(){
        try{
            const livros = livro.find().populate("categoria").lean()
            res.json(livros)
        }catch(err){
            res.status(404).json({Erro: `Erro encontrado: ${err}`})
            /*sobre os status
             200 = OK
             201 = novo criado
             204 = realizada com sucesso, mas nao devolve nada ao cliente
             401 = invalido
             404 = não encontrado
             500 = erro interno
            */
        }      
    }
    buscando()
})

router.post("/adicionar", (req, res)=>{
  

})

module.exports = router

