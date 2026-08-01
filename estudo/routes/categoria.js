const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
require("../models/categoria")
const cat = mongoose.model("categorias")

router.get("/listagem", (req, res)=>{
    async function buscando(){
        try{
            const categoria = await cat.find().lean()
            res.json(categoria)
        }catch(err){
            res.status(404).json({Erro: `Erro encontrado: ${err}`})
        }
    }
    buscando()
})

router.post("/adicionar", async (req, res)=>{
        try{
            const addcat = {
                nome: req.body.nome
            }
         const novo = await new cat(addcat).save()
         res.status(201).json(novo)  
        }catch(err){
            res.status(500).json({mensagem: "erro interno"})
        }
})



module.exports = router
