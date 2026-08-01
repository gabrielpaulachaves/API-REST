const mongoose = require("mongoose")

const schema = mongoose.Schema

const livros = new schema({
    titulo:{
        type: String,
        required: true
    },
    autor:{
        type: String,
        required: true
    },
    ano:{
        type: Number,
        required: true
    },
    descricao:{
        type: String,
        required: true
    },
    categoria:{
        type: schema.Types.ObjectId,
        required: true,
        ref: "categorias"
    }
})

mongoose.model("livros", livros)