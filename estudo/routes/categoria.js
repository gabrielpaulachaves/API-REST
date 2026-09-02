const express = require("express")
const mongoose = require("mongoose")
const { jsx } = require("react/jsx-runtime")
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
                                if(!("ordem" in campo)){
                                    sorted[campo[key]] = 1
                                }else{
                                  if(isNaN(ordem)){
                                    return res.status(400).json({mensagem: "Digite 1 ou -1 para ordenar"})
                                }if(ordem != 1 && ordem != -1){
                                    return res.status(400).json({mensagem: "Digite 1 ou -1 para ordenar"})    
                                }  
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
        }
        const categoria = await cat.find(filtro).limit(guardar.limit).sort(sorted).lean()
            res.status(200).json(categoria)  
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
            const addcat = req.body
           
            if(!Object.hasOwn(addcat, "nome")){
                return res.status(400).json({mensagem: "Só é permitido o campo 'nome'"})
            }
            const verificando = Object.keys(addcat)
            if(verificando.length >1){
                return res.status(400).json({mensagem: "Só é permitido o campo 'nome'"})
            }
            if(typeof(addcat.nome) == "string"){
                if(addcat.nome.trim() == ""){
                 return res.status(400).json({mensagem: "Não foi adicionado valor"})   
                }    
            }else{
               return res.status(400).json({mensagem: "Só é permitido texto"}) 
            }
            const novocat = {nome: addcat.nome}

         const novo = await new cat(novocat).save()
         res.status(201).json(novo)  
        }catch(err){
            res.status(500).json({mensagem: "erro interno"})
        }
})

router.put("/:id", async (req, res)=>{
    try{
        const att = req.body
        
        if(!mongoose.isValidObjectId(req.params.id)){
            return res.status(400).json({mensagem: "Coloque um ID válido"})
        }
        if(!Object.hasOwn(att, "nome")){
            return res.status(400).json({mensagem: "Só é permitido apenas o campo 'nome'"})
        }
        const arr = Object.keys(att)
        if(arr.length > 1){
            return res.status(400).json({mensagem: "Só é permitido apenas o campo 'nome'"})
        }
        if(typeof(att.nome) == "string"){
            if(att.nome.trim() == ""){
             return res.status(400).json({mensagem: "O campo 'nome' está vazio"})   
            }
        }else{
            return res.status(400).json({mensagem: "Tipo de valor para 'nome' inválido"})
        }
        const novoput = {nome: att.nome}

        const dado = await cat.findOneAndUpdate({_id: req.params.id}, novoput, {new: true})
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
