const mongoose=require('mongoose');

const usuarioSchema=new mongoose.Schema({
    nombre:{
        type:String,
        required:true
    },
    usuario:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    foto:{
        type:String,
        required:true
    },
    estado:{
        type:Boolean,
        default:true
    },
    tipo:{
        type:String,
        default:'usuario'
    }
});

module.exports=mongoose.model('usuario',usuarioSchema);