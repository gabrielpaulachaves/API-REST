const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
require("../models/livros")
const livro = mongoose.model("livros")

router.get("/",async (req, res)=>{ 
        try{
            const livros = await livro.find().populate("categoria").lean()
            res.json(livros)
        }catch(err){
            res.status(404).json({Erro: `Erro encontrado: ${err}`})
            /*sobre os status
             200 = OK
             201 = novo criado
             204 = realizada com sucesso, mas nao devolve nada ao cliente
             400 = invalido
             404 = não encontrado
             500 = erro interno
            */    
    }

})

router.post("/", async (req, res)=>{
    try{
    const addlivro = {
        titulo: req.body.titulo,
        autor: req.body.autor,
        ano: req.body.ano,
        descricao: req.body.descricao,
        categoria: req.body.categoria
    }
    const novo = await new livro(addlivro).save()
    res.status(201).json(novo)
    }catch(err){
        res.status(500).json({mensagem: "Erro interno"})
    }
})

router.put("/:id", async (req, res)=>{
    try{
        const att = {
        titulo: req.body.titulo,
        autor: req.body.autor,
        ano: req.body.ano,
        descricao: req.body.descricao,
        categoria: req.body.categoria        
       } 
       const dado = await livro.findOneAndUpdate({_id: req.params.id}, att, {new: true})
       res.status(200).json(dado)

    }catch(err){
        res.status(500).json({mensagem: "Erro interno "+ err})
    }       
})

module.exports = router

