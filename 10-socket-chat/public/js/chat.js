const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/api/auth/'
            : 'https://restserver-curso-fher.herokuapp.com/api/auth/';


const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');


let usuario = null;
let socket = null;


const validarJWT = async() => {

    const token = localStorage.getItem('token');

    
    if(!token){
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    if(token.length<= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch(url, {
        headers: {'x-token':token}
    })

    const {usuario:userDB, token:tokenDB} = await resp.json();
    localStorage.setItem('token', tokenDB);
    usuario = userDB;

    document.title = usuario.nombre;

    await conectarSocket();

}

const conectarSocket = async() => {
    socket = io({
        'extraHeaders':{
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', ()=>{
        console.log('Sockets online')
    });

    socket.on('disconnect', ()=>{
        console.log('Sockets offline')
    });

    socket.on('recibir-mensajes',dibujarMensajes);
    // La manera de arriba o de abajo hacen lo mismo
    socket.on('usuarios-activos',(payload) => {
        dibujarUsuarios(payload);
    });

    socket.on('mensaje-privado',(payload) => {
        console.log(payload);
    });

}



const dibujarUsuarios = (usuarios = []) => {
    let usersHtml = '';
    usuarios.forEach(user => {
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success">${user.nombre}</h5>
                    <span class = "fs-6 text-muted">${user.uid}</span>
                </p>
            </li>
        `;
    });

    ulUsuarios.innerHTML = usersHtml;
};


const dibujarMensajes = (mensajes = []) => {
    let mensajessHtml = '';
    mensajes.forEach( ({nombre,mensaje}) => {
        mensajessHtml += `
            <li>
                <p>
                    <span class="text-primary">${nombre}</span>
                    <span>${mensaje}</span>
                </p>
            </li>
        `;
    });

    ulMensajes.innerHTML = mensajessHtml;
};


txtMensaje.addEventListener('keyup',({keyCode}) => {
    
    const mensaje =txtMensaje.value;
    const uid =txtUid.value;
    
    if(keyCode !== 13){return;}
    if(mensaje.length===0){return;}

    socket.emit('envia-mensaje',{mensaje,uid});

    txtMensaje.value = '';

})



function signOut() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    console.log('User signed out.');
    });
    window.location = '/';
}

function onLoad() {
    gapi.load('auth2', function() {
      gapi.auth2.init();
    });
}

const main = async() => {

    await validarJWT();

}

main()


//const socket = io();