const express=require('express');
const mogoose=require('mongoose');
const session=require('express-session');
const path=require('path');
const usuarios=require('./rutas/rutasUsuarios');
const cors=require('cors');

mogoose.connect('mongodb+srv://rene:abcRene123@cluster0.pjhyn.mongodb.net/ejemplo1?retryWrites=true&w=majority',{ useUnifiedTopology: true, useNewUrlParser: true })
.then(()=>{
    console.log("Conectado a MongoDB");
})
.catch((err)=>{
    console.log("Error al conectarse a MongoDB "+err);
});
mogoose.set('useFindAndModify', false);//Para poder realizar modificaciones en la BD

const app=express();
app.set('view engine', 'ejs');
app.use('/misitio',express.static(path.join(__dirname,'/webPages')));//Sitio estático
app.use(session({
    secret:"lo que sea",
    resave:true,
    saveUninitialized:true
}));
app.use(cors());
app.use(express.urlencoded({extended:true}));//Para poder recibir datos del formulario
app.use('/',usuarios);//Indicar que las rutas dinámicas estan en rutasUsuarios


const port=process.env.PORT || 3001;
app.listen(port,()=>{
    console.log(`Servidor en el puerto ${port}`);
});