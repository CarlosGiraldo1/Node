const Tarea = require('./tarea')

class Tareas {

    get listadoArr(){
        const listado = [];
        Object.keys(this._listado).forEach(key =>{
            const tarea = this._listado[key];
            listado.push(tarea);
        });

        return listado;
    };

    constructor(){
        this._listado = {};
    }

    borrarTarea(id=''){
        if (this._listado[id]){
            delete this._listado[id];
        }
    }

    cargarTareasFromArray(tareas = []){
        tareas.forEach(tarea => {
            this._listado[tarea.id] = tarea;
        })
        
    }

    crearTarea(desc= '') {
        const tarea = new Tarea(desc);

        this._listado[tarea.id] = tarea;
    }

    listadoCompleto(){
        console.log();
        let cont = 1;
        this.listadoArr.forEach(tarea => {
            let str = cont.toString().green
            str = str + '. '.green 
            str =str + `${tarea.desc} :: `;

            if (tarea.completado){
                console.log(str+'COMPLETADO'.green);
            }else{
                console.log(str+'PENDIENTE'.red);
            }

            cont = cont+1;

        })
    }

    listarPendientesCompletadas(completadas = true){
        console.log()
        let cont = 1;

        this.listadoArr.forEach(tarea => {
            let str = cont.toString().green
            str = str + '. '.green 
            str =str + `${tarea.desc} :: `;

            if (completadas){
                if (tarea.completado){
                    console.log(str+'COMPLETADO'.green+' en '+tarea.completado);
                    cont = cont+1;
                }
            }else{
                if (!tarea.completado){
                    console.log(str+'PENDIENTE'.red);
                    cont = cont+1;
                }
            }
        })
    }

    toggleCompletadas(ids=[]){
        ids.forEach(id => {
            const tarea = this._listado[id];
            //console.log(tarea);
            
            if(!tarea.completado){
                tarea.completado= new Date().toISOString();
            }
        });

        this.listadoArr.forEach(tarea =>{
            if(!ids.includes(tarea.id)){
                this._listado[tarea.id].completado = null;
            }
        })
    }
}

module.exports = Tareas;