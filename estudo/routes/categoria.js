const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
require("../models/categoria")
const cat = mongoose.model("categorias")

router.get("/", async (req, res)=>{
        try{
                //logica disso, o trim() remove os espaços, ex " " vira "", e "" é considerado false, e o ! transforma esse false em true. Ou seja, SE for verdade, vai cair dentro desse if
            if(!req.body._id.trim()){
            const categoria = await cat.find().lean()
            res.status(200).json(categoria)                
            }else{
                const categoria2 = await cat.findById({_id: req.body._id}).lean()
                res.status(200).json(categoria2)
            }
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
