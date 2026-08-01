const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
require("../models/livros")
const livro = mongoose.model("livros")

router.get("/listagem", (req, res)=>{

    async function buscando(){
        try{
            let livros = livro.find().lean()
        }catch(err){
            console.log(`Ouve um erro: ${err}`)
        }      
    }
})

module.exports = router

