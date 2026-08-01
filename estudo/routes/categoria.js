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
router.post("/adicionar", (req, res)=>{
  

})



module.exports = router
