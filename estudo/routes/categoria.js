const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
require("../models/categoria")
const cat = mongoose.model("categorias")

router.get("/", async (req, res)=>{
        try{
            const categoria = await cat.find().lean()
            res.json(categoria)
        }catch(err){
            res.status(500).json({Erro: `Erro encontrado: ${err}`})
        }

})

router.post("/", async (req, res)=>{
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

router.put("/:id", async (req, res)=>{
    try{
        const att = {
            nome: req.body.nome
        }
        const dado = await cat.findOneAndUpdate({_id: req.params.id}, att, {new: true})
        res.status(200).json(dado)
    }catch(err){
        if(!dado){
            res.status(400).json()
        }
        res.status(500).json({mensagem: "erro interno"})
    }
})
router.delete("/:id", async (req, res)=>{
    try{
        const del = await cat.findOneAndDelete({_id:req.params.id})
        res.status(204).send()
    }catch(err){
        res.status(500).json({mensagem: "erro interno"})
    }
})


module.exports = router
