const mongoose = require("mongoose")

    async function conectando() {
        try{
            const mongo = await mongoose.connect("mongodb://localhost/livraria")
            console.log("Mongoose conectado")
        }catch(err){
            console.log(`Um erro ocorreu: ${err}`)
        }   
    }

