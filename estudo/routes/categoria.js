const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
require("../models/categoria")
const cat = mongoose.model("categorias")

router.get("/", async (req, res)=>{
    try{
        const campo = req.query
        const controles = ["limit", "sort"]
        const parametros = ["nome"]
        const ordem = parseInt(campo.ordem)
        const sorted = {}
        const filtro = {}
        const guardar = {}
        for (const key in campo){
            if(controles.includes(key)){
                    if(key=="sort"){
                        if(campo[key]!="nome"){
                            return res.status(400).json({mensagem:"valor de sort inválido"})
                        }else{
                                if(isNaN(ordem)){
                                    return res.status(400).json({mensagem: "Digite 1 ou -1 para ordenar"})
                                }else if(ordem != 1 && ordem != -1){
                                    return res.status(400).json({mensagem: "Digite 1 ou -1 para ordenar"})    
                                }else if(!("ordem" in campo)){
                                    sorted[campo[key]] = 1
                                }else{
                                 sorted[campo[key]] = ordem   
                                }
                            }
                    }else if(key=="limit"){
                        if(isNaN(campo[key])){
                           return res.status(400).json({mensagem: "Digite apenas numeros"}) 
                        }else if(campo[key] <=0){
                           return res.status(400).json({mensagem: "Digite um numero maior que 0"}) 
                        }else{
                            guardar[key] = campo[key]
                        }
                    }   
            }else if(parametros.includes(key)){
                    filtro[key] = {
                        $regex: campo[key],
                        $options: "i"}
                    } 
            const categoria = await cat.find(filtro).limit(guardar.limit).sort(sorted).lean()
            res.status(200).json(categoria)                
        }
    }catch(err){
            res.status(500).json({Erro: `Erro interno`})
        }
})

router.get("/:id", async (req, res)=>{
    try{
        if(!mongoose.isValidObjectId(req.params.id)){
            return res.status(400).json({mensagem: "ID inválido"})
        }
        const catfiltro = await cat.findById({_id: req.params.id}).lean()
        if(!catfiltro){
           return res.status(404).json({mensagem: "Categoria não encontrada"})
        }
        res.status(200).json(catfiltro)
    }catch(err){
        res.status(500).json({Erro: `Erro interno: ${err}`})
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
        
        if(!mongoose.isValidObjectId(req.params.id)){
            return res.status(400).json({mensagem: "Coloque um ID válido"})
        }
        const dado = await cat.findOneAndUpdate({_id: req.params.id}, att, {new: true})
        if(!dado){
            return res.status(404).json({mensagem: "ID não existe"})
        } 
            return res.status(200).json(dado)     
    }catch(err){   
        res.status(500).json({mensagem: "erro interno"})
    }

    //resultado teste forçando erro = 500 Internal Server Error

    //resultado teste forçando erro = 400 Bad Request (corrigido)
})
router.delete("/:id", async (req, res)=>{
    try{
        const del = await cat.findOneAndDelete({_id:req.params.id})
        if(!del){
          return res.status(404).json({mensagem: "ID não encontrado"})  
          //é necessario o return para que a execução acabe aqui e não continue
        }   
        return res.status(204).send()
    }catch(err){
        res.status(500).json({mensagem: "erro interno"})
    }

    //resultado teste forçando erro = 500 Internal Server Error
    //análise = dava erro 500 pois estava usando .json() e não .send()
    //resultado teste forçando erro = 404 Not Found (corrigido)
})



module.exports = router
