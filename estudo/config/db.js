const mongoose = require("mongoose")

    async function conectando() {
        try{  
            await mongoose.connect("mongodb://127.0.0.1:27017/livraria")
            console.log("Mongoose conectado")
        }catch(err){
            console.log(`Um erro ocorreu: ${err}`)
        }   
    }
    conectando()

