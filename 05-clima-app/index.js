require('dotenv').config()
const { leerInput,
        inquirerMenu, 
        pausa,
        listarLugares} = require("./helpers/inquirer")
const Busquedas = require("./models/busquedas");

const main = async() =>{

    const busquedas = new Busquedas();
    let opt;
    
    do{
    opt = await inquirerMenu();
    
    switch (opt){
        case 1:

            const lugar = await leerInput('Ciudad');
            const lugares = await busquedas.ciudad(lugar);
            const id = await listarLugares(lugares);
            if (id === '0')continue;

            const lugarSel = lugares.find(l => l.id ===id);
            //console.log(lugarSel.nombre);
            busquedas.agregarHistorial(lugarSel.nombre);
            
            const clima = await busquedas.clima(lugarSel.lat,lugarSel.lng)
            //console.log(clima);

            console.clear()
            console.log('\nInformación de la ciudad\n'.green);
            console.log('Ciudad:',lugarSel.nombre);
            console.log('Lat:',lugarSel.lat);
            console.log('Lng:',lugarSel.lng);
            console.log('Temperatura:',clima.temp);
            console.log('Minima:',clima.min);
            console.log('Maxima:',clima.max);
            console.log('Descripción clima:',clima.desc);
        break;

        case 2:
            busquedas.historialCapitalizado.forEach((lugar, i) => {
                const idx = `${i+1}.`.green;
                console.log(`${idx} ${lugar}`);
            })
        break;
    }

    
    if (opt !==0) await pausa();
    }while(opt!==0)
} 

main()