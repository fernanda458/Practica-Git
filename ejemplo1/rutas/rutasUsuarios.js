const {Router}=require('express');
const ruta=Router();
const Usuario=require('../modelos/usuarioModelo');

ruta.get('/',(req,res)=>{
    res.render('inicio',{titulo:"Estas en home"});
});

ruta.get('/contacto',(req,res)=>{
    res.render('contactanos');
});

ruta.post('/login',(req,res)=>{
    var {usuarioLogin,passwordLogin}=req.body;
    Usuario.find({"usuario":usuarioLogin, "password":passwordLogin})
    .then((usu)=>{
        if(usu==""){
            res.redirect('/logout')
        }
        else{
            console.log(usu[0].tipo);
            if(usu[0].tipo=='usuario'){
                req.session.usuario=usu[0].nombre;
                res.redirect('/mostrarUsuarios');
            }
            if(usu[0].tipo=='admin'){
                req.session.usuarioAdmin=usu[0].nombre;
                res.redirect('/mostrarUsuariosAdmin');                
            }
            if(usu[0].tipo=='editor'){
                req.session.usuarioEditor=usu[0].nombre;
                res.redirect('/mostrarUsuariosEditor');                
            }
        }
    })
    .catch(()=>{
        res.status(400).send("Error al consultar tus credenciales");
    });
});

ruta.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/');
});

ruta.get('/insertarUsuario',(req,res)=>{
    res.render('insertarUsuario');
});

//Guarda un nuevo usuario NODEJS
ruta.post('/insertarUsuario',(req,res)=>{
   var usuario=new Usuario({
        nombre:req.body.nombre,
        usuario:req.body.usuario,
        password:req.body.password,
        foto:req.body.foto
   });

   usuario.save()
   .then(()=>{
       res.redirect('/mostrarUsuarios');
   })
   .catch((err)=>{
        res.status(400).send("Error al guardar el usuario "+err);
   });

});



// API GUARDA USUARIO CUALQUIER APP
ruta.post('/api/insertarUsuario',(req,res)=>{
    var usuario=new Usuario({
         nombre:req.body.nombre,
         usuario:req.body.usuario,
         password:req.body.password,
         foto:req.body.foto
    });
 
    usuario.save()
    .then(()=>{
        res.json("insertado");
        //j Java
        //s Script
        //o Object
        //n 
    })
    .catch((err)=>{
         res.json("error");
    });
 
 });
 
//Mostrar usuarios NODEJS
ruta.get('/mostrarUsuarios',(req, res)=>{
    if(!req.session.usuario){
        res.redirect('/');
    }

    Usuario.find({"estado":true})
    .then((usu)=>{
        res.render('mostrarUsuarios',{usuarios:usu});
        res.end();
    })
    .catch((err)=>{
        res.status(400).send("Erro al recuperar la información");
    });    
});

//API MOSTRAR USUARIOS
ruta.get('/api/mostrarUsuarios',(req, res)=>{
    Usuario.find({"estado":true})
    .then((usu)=>{
        res.json(usu);
    })
    .catch((err)=>{
        res.json("error");
    });    
});

//BUSCAR USUARIO POR ID NODEJS
ruta.get('/modificarUsuario/:id',(req,res)=>{
    var id=req.params.id;
    Usuario.findById(id)
    .then((usu)=>{
        res.render('modificarUsuario',{usuario:usu});
    })
    .catch((err)=>{
        res.status(400).send("Error al buscar el usuario "+err);
    });
});

//API BUSCAR USUARIO POR ID
ruta.get('/api/modificarUsuario/:id',(req,res)=>{
    var id=req.params.id;
    Usuario.findById(id)
    .then((usu)=>{
        res.json(usu);
    })
    .catch((err)=>{
        res.json("error");
    });
});

// MODIFICAR USUARIO NODEJS
ruta.post('/modificarUsuario',(req,res)=>{
    var id=req.body.idModificar;
    Usuario.findByIdAndUpdate(id,{
        $set:{
            nombre:req.body.nombreModificar,
            usuario:req.body.usuarioModificar,
            password:req.body.passwordModificar,
            foto:req.body.fotoModificar
        }
    },
    {new:true}
    )
    .then(()=>{
        res.redirect('/mostrarUsuarios');
    })
    .catch((err)=>{
        res.status(400).send("Error al actualizar el registro "+err);
    });
});

// API USUARIO NODEJS
ruta.post('/api/modificarUsuario',(req,res)=>{
    var id=req.body.idModificar;
    Usuario.findByIdAndUpdate(id,{
        $set:{
            nombre:req.body.nombreModificar,
            usuario:req.body.usuarioModificar,
            password:req.body.passwordModificar,
            foto:req.body.fotoModificar
        }
    },
    {new:true}
    )
    .then(()=>{
        res.json("actualizado");
    })
    .catch((err)=>{
        res.json("error");
    });
});

//ELIMINAR USUARIO NODEJS
ruta.get('/eliminarUsuario/:id',(req,res)=>{
    var id=req.params.id;
    Usuario.findByIdAndDelete(id)
    .then(()=>{
        res.redirect('/mostrarUsuarios');
    })
    .catch((err)=>{
        res.status(400).send("Error al eliminar el usuario");
    });
});

//API ELIMINAR USUARIO
ruta.get('/api/eliminarUsuario/:id',(req,res)=>{
    var id=req.params.id;
    Usuario.findByIdAndDelete(id)
    .then(()=>{
        res.json("eliminado");
    })
    .catch((err)=>{
        res.json("error");
    });
});

//BUSCAR
ruta.post('/buscar',(req, res)=>{
    var buscar=req.body.buscar;
    Usuario.find({usuario:buscar})
    .then((usu)=>{
        res.render('mostrarUsuarios',{usuarios:usu});
    })
    .catch((err)=>{
        res.status(400).send("Error en la búsqueda");
    });
});
//API BUSCAR
ruta.get('/api/buscar/:nombre',(req, res)=>{
    var buscar=req.params.nombre;
    console.log(buscar);
    Usuario.find({nombre:buscar})
    .then((usu)=>{
        res.json(usu);
    })
    .catch((err)=>{
        res.json('error');
    })
});

module.exports=ruta;