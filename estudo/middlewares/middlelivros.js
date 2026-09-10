const express = require("express")
const mongoose = require("mongoose")
const categoriapop = mongoose.model("categorias")


function validar(val, http){
    const filtro = val
    
    if(http == "post"){
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
    req.newli = newli
    next()
        }catch(err){
            res.status(500).json({mensagem: "Erro interno"})
            console.log(err)
        }
    }
        return autenticado

    }else if(http == "put"){

         async function atualizado(req, res, next) {
        try{
            const att = req.body
            const novoobj = {}
        if(!mongoose.isValidObjectId(req.params.id)){
            return res.status(400).json({mensagem: "Coloque um ID válido"})
        }
        
    for (const key in att) {
        if(!filtro.includes(key)){
                return res.status(400).json({mensagem: "Há campos não permitidos"})
            }else{
            if(key == "titulo" || key == "autor" || key == "descricao"){
               if(typeof(att[key]) == "string"){
                if(att[key].trim() == ""){
                    return res.status(400).json({mensagem: "Há campos vazios"})
                }else{
                  novoobj[key] = att[key]  
                }
               }else{
                return res.status(400).json({mensagem: "O valor de algum campo não é permitido"})
               }    
            }

            if(key == "ano"){
                if(typeof(att[key]) == "object" || typeof(att[key]) == "boolean"){
                    return res.status(400).json({mensagem: "Tipagem de ano inválida"})
                }
                const convert = Number(att[key])
                if(isNaN(convert)){
                    return res.status(400).json({mensagem: "Valor de ano inválido"})
                }
                if(convert > 2026 || convert == 0){
                    return res.status(400).json({mensagem: "Coloque um ano que não seja maior que o ano atual e diferente de 0"})
                }
                if(!Number.isInteger(convert)){
                   return res.status(400).json({mensagem: "Coloque valores inteiros"}) 
                }
               novoobj[key] = att[key] 
            } 

            if(key == "categoria"){
                if(!mongoose.isValidObjectId(att[key])){
                    return res.status(400).json({mensagem: "ID de categoria inválido"})
                }
                const catte = await categoriapop.findById(att[key])
                if(catte == null){
                    return res.status(404).json({mensagem: "essa categoria não existe"})
                }
                novoobj[key] = att[key]
            }   
        }
    }
    req.attcompleto = novoobj
    next()
        }catch(err){
            res.status(500).json({mensagem: "Erro interno"})
            console.log(err)
        }
        
    }
        return atualizado

    }else if(http == "patch"){

        async function parcial(req, res, next){
        try{
             const attparcial = req.body
                    const att = {} 
            
                    if(!mongoose.isValidObjectId(req.params.id)){
                      return  res.status(400).json({mensagem: "Coloque um ID válido"})
                    }
            
                    for (const key in attparcial) {

                        if(!filtro.includes(key)){
                          return res.status(400).json({mensagem: "Campo não existente digitado"})
                        }else{


                            if(key == "titulo" || key == "autor" || key == "descricao"){
                            if(typeof(attparcial[key]) == "string"){
                                if(attparcial[key].trim() == ""){
                                    return res.status(400).json({mensagem: "Há campos vazios"})
                                }else{
                                    att[key] = attparcial[key]
                                }
                            }else{
                                    return res.status(400).json({mensagem: "só são permitido texto nos campos 'titulo', 'autor' e 'descricao' "})
                                }
                        }else if(key == "ano"){
                            if(typeof(attparcial[key]) == "object" || typeof(attparcial[key]) == "boolean"){
                                return res.status(400).json({mensagem: "Tipagem de ano inválida"})
                        }
                        const converter = Number(attparcial[key])
                        if(isNaN(converter)){
                            return res.status(400).json({mensagem: "Ano não é um número"})
                        }
                        if(converter > 2026 || converter == 0){
                            return res.status(400).json({mensagem: "Não é permitido ano maior que o ano atual ou igual a 0"})
                        }
                        if(!Number.isInteger(converter)){
                            return res.status(400).json({mensagem: "Não é permitido ano com valor decimal"})
                        }
                        att[key] = converter
                        }else if(key == "categoria"){
                            if(!mongoose.isValidObjectId(attparcial[key])){
                            return res.status(400).json({mensagem: "ID da categoria inválida"})
                        }
                        const catebuscar = await categoriapop.findById(attparcial[key])
                        if(catebuscar == null){
                            return res.status(404).json({mensagem: "Categoria não existe"})
                        }
                        att[key] = attparcial[key]
                        }else{
                            return res.status(500).json({mensagem: "Verificação de campos não foi realizada com sucesso."})
                        }
                    }
                    }
                    req.att = att
             next()       
        }catch(err){
            res.status(500).json({mensagem: "Erro interno"})
            console.log(err)
        }
        
    }
        return parcial
    }else{
        throw new Error("Parâmetro de método inválido.")
        //a diferença do throw new Error para um res.status(500) é que o res.status() só funciona quando há uma requisicao HTTP (cliente/servidor), já o throw new error é direto pro codigo, ele nao fala com a requisicao, ele existe antes de qualquer requisicao existir 
    } 
    
}

module.exports = validar