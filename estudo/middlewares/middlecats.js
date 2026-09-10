const express = require("express")
const mongoose = require("mongoose")

function validar(http){
    
    if(http == "post"){

     async function postar(req, res, next){
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
            
           req.novocat = novocat 
          next()
    }catch(err){
        res.status(500).json({mensagem: "erro interno"})
    } 
     
    }
    return postar
    
}else if(http == "put"){

    async function atualizar(req, res, next){
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

                   req.novoput = novoput 
                   next()
        }catch(err){
            res.status(500).json({mensagem: "erro interno"})
        }

        
    }

    return atualizar
}else{
    throw new Error("Erro no método HTTP");
    
}

}
module.exports = validar



