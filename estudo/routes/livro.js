const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
require("../models/livros")
const livro = mongoose.model("livros")
            /*sobre os status
             200 = OK
             201 = novo criado
             204 = realizada com sucesso, mas nao devolve nada ao cliente
             400 = invalido
             404 = não encontrado
             500 = erro interno
            */   

router.get("/",async (req, res)=>{ 
        try{  
            const filtroquery = {}
            const campo = req.query
            const filtros = ["titulo", "autor", "ano", "descricao"]  
            const control = ["limit", "sort", "page"]  
            const guardar = {}
            for (const key in campo) {
                             //no primeiro loop, seria "titulo", mas como essa chave nao existe no objeto filtroquery, ao fazer = {}, a gente adiciona ela lá. Quem está fornecendo para esse objeto é o for in   
                            //objeto[key]          → LER/acessar
                            //objeto[key] = valor  → ESCREVER/atribuir     
                if(control.includes(key)){
                    guardar[key] = campo[key]
                }else if(filtros.includes(key)){
                            if(key=="ano"){
                                filtroquery[key] = campo[key] //ex: filtroquery[titulo] = campo[titulo]
                            }else{
                              filtroquery[key] = {
                    $regex: campo[key],
                    $options: "i" //torna case-insensitive
                              }   
                            }  
                }else{
                   return res.status(400).json({mensagem: "Campo inexistente"})
                }                     
            }      
            const livros = await livro.find(filtroquery).populate("categoria").limit(guardar.limit).sort(guardar.sort).lean()
            res.status(200).json(livros)                
        }catch(err){
            res.status(500).json({Erro: `Erro interno: ${err}`})
    }
})

router.get("/:id", async (req, res)=>{
    try{
        if(!mongoose.isValidObjectId(req.params.id)){
            //logica do return = depois dessa resposta, ainda há codigo para ser executado?
            return res.status(400).json({mensagem: "ID inválido"})
        }        
        const livrofiltro = await livro.findOne({_id: req.params.id}).populate("categoria").lean() 
        if(!livrofiltro){
           return res.status(404).json({mensagem: "livro não encontrado"})
        }else{
            res.status(200).json(livrofiltro) 
        }
           
    }catch(err){
        console.log(err)
        res.status(500).json({Erro: `Erro interno: ${err}`})
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
        if(!dado){
            return res.status(404).json({mensagem: "ID não existe"})
            
        }       
    return res.status(200).json(dado)
    }catch(err){
        res.status(500).json({mensagem: "Erro interno "+ err})
    } 

    //resultado teste forçando erro = 400 Bad Request   
})

router.delete("/:id", async (req, res)=>{
    try{
        const del = await livro.findOneAndDelete({_id: req.params.id})
        if(!del){
            return res.status(404).json({mensagem: "ID não encontrado"})
        }        
        return res.status(204).send()
                            //use send() pois 204 nao responde a corpo, JSON sim
    }catch(err){
        res.status(500).json({mensagem: "erro interno"})
    }

    //resultado teste forçando erro = 404 Not Found
})

router.patch("/:id", async (req, res)=>{
    try{
        const attparcial = req.body
        const dadoparcial = await livro.findOneAndUpdate({_id: req.params.id}, attparcial, {new: true})
        res.status(200).json(dadoparcial)
    }catch(err){
      res.status(500).json({mensagem: "erro interno"})  
    }
})

module.exports = router

/*    
    //a logica disso aqui foi, tenho um objeto vazio, uma const que recebe o objeto do body e uma const referente a cada propriedade do objeto do body. 
const attparcial = {}
        const campo = req.body
                //essa primeira const sempre vai se referir as propriedades
        for (const prop in campo) {
                                //quando faço isso, pego o valor daquela propriedade
                                //exemplo, se a propriedade for "titulo" e essa propriedade guarda um valor "George Orwell", entao campo[prop] == "George Orwell"
            attparcial[prop] = campo[prop]
        } */