require('colors');
const { guardarDB,leerDB } = require('./helpers/guardarArchivo');
// const {mostrarMenu, pausa} = require('./helpers/mensajes');
const {inquirerMenu,
    pausa,
    leerInput,
    listadoTareasBorrar,
    confirmar,
    mostrarListadoCheacklist} = require('./helpers/inquire');
const Tarea = require('./models/tarea');
const Tareas = require('./models/tareas');

console.clear();

const main = async() =>{

    //console.log('Hola Mundo');

    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();
    //await pausa();

    if (tareasDB){
        tareas.cargarTareasFromArray(tareasDB);
    }

    do{
        //opt = await mostrarMenu();
        opt = await inquirerMenu();
        //console.log({opt});

        switch(opt) {
            case '1':
                const desc = await leerInput('Descripcion: ');
                tareas.crearTarea(desc);
                break;
            case '2':
                //console.log(tareas.listadoArr);
                tareas.listadoCompleto();
                break;
            case '3':
                //console.log(tareas.listadoArr);
                tareas.listarPendientesCompletadas();
                break;
            case '4':
                //console.log(tareas.listadoArr);
                tareas.listarPendientesCompletadas(false);
                break;
            case '5':
                const ids = await mostrarListadoCheacklist(tareas.listadoArr);
                tareas.toggleCompletadas(ids);
                break;

            case '6':
                const id = await listadoTareasBorrar(tareas.listadoArr);
                if(id!=='0'){
                    const ok = await confirmar('¿Estas seguro?');
                    if(ok){
                        tareas.borrarTarea(id);
                        console.log('Tarea borrada');
                    }
                }
                
                break;

        }


        guardarDB(tareas.listadoArr);

        /*
        const tareas = new Tareas('Comprar comida');
        console.log(tareas);

        const tarea = new Tarea('Comprar comida');
        console.log(tarea);

        tareas._listado[tarea.id] = tarea
        console.log(tareas);

        */

        //if (opt !== '0') await pausa();
        if (opt !== '0') await pausa();

    }while(opt != '0');

}

main();