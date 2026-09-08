const express = require("express")
const mongoose = require("mongoose")

function validar(val){
    const filtro = val

    async function autenticado(req, res, next){
        const body = req.body
        const newli = {}
        try{
if(!("titulo" in body) || !("autor" in body) || !("ano" in body) || !("descricao" in body) || !("categoria" in body)){
        return res.status(400).json({mensagem: "Campos em falta. Certifique-se de que os campos 'titulo', 'autor', 'ano', 'descricao' e 'categoria' estejam adicionados"})
       }
       
    for(const key in body) {
        
       if(!filtro.includes(key)){
        return res.status(400).json({mensagem: "Um campo não permitido foi adicionado"})
       }else{
        if(key == "titulo" || key == "autor" || key == "descricao"){
            if(typeof(body[key]) == "string"){
               if(body[key].trim() == ""){
           return res.status(400).json({mensagem: "Não foi adicionado valor a algum campo"}) 
        }else{
          newli[key] = body[key]   
        }  
            }else{
             return res.status(400).json({mensagem: "O valor de algum campo não é permitido"})    
            }
        }
       
        if(key=="ano"){
            if(typeof(body[key]) == "object" || typeof(body[key]) == "boolean"){
               return res.status(400).json({mensagem: "Tipagem de ano inválida"}) 
            }
            const numeru = Number(body[key])
            if(isNaN(numeru)){
                return res.status(400).json({mensagem: "Digite o ano de lançamento do livro"})
            }
            if(numeru > 2026 || numeru == 0){
                return res.status(400).json({mensagem: "Digite um ano válido"})
            }
            if(!Number.isInteger(numeru)){
                return res.status(400).json({mensagem: "Não é permitido anos decimais"})
            }
               newli[key] = numeru  
        }

        if(key=="categoria"){
            if(!mongoose.isValidObjectId(body[key])){
                return res.status(400).json({mensagem: "ID inválido"})
            }
            const cate = await categoriapop.findById(body[key])
            if(cate == null){
                return res.status(404).json({mensagem: "Categoria não encontrado"})
            }
                newli[key] = body[key]        
        }   
       }    
    }
    next()
        }
        catch{
            res.status(500).json({mensagem: "Erro interno"})
        }
    }

    return autenticado
}

module.exports = validar