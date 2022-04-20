const { comprobarJWT } = require("../helpers");
const {ChatMensajes} = require('../models');

const chatMensajes = new ChatMensajes();

const socketController = async( socket, io ) => {

    const token = socket.handshake.headers['x-token'];

    const usuario = await comprobarJWT(token);

    if(!usuario){
        return socket.disconnect();
    }

    // agregar usuario
    chatMensajes.conectarUsuario(usuario);
    io.emit('usuarios-activos',chatMensajes.usuariosArr);
    socket.emit('recibir-mensajes', chatMensajes.ultimos10);
    socket.join(usuario.id);


    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos',chatMensajes.usuariosArr);
    });

    socket.on('envia-mensaje',({uid,mensaje}) => {

        if(uid){
            socket.to(uid).emit('mensaje-privado',{de: usuario.nombre,mensaje});
        }else{
            chatMensajes.enviarMensaje(usuario.uid, usuario.nombre, mensaje);
            io.emit('recibir-mensajes', chatMensajes.ultimos10);
        }

        
    })
    
}

module.exports = {
    socketController
}