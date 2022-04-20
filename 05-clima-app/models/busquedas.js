const fs = require('fs');

const axios = require('axios');

class Busquedas{

    historial = [];
    dbPath = './db/database.json';

    constructor(){
        this.leerDB();
    }

    get historialCapitalizado(){

        this.historial.forEach((lugar,ind) => {
            // this.historial[i] = lugar[0].toUpperCase() + lugar.slice(1);

            let words = lugar.split(" ");

            for (let i = 0; i < words.length; i++) {
                if (words[i][0]){
                    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
                }
            }

            this.historial[ind] = words[0];

            for (let i = 1; i < words.length; i++) {
                this.historial[ind] = this.historial[ind] + ' ' + words[i];
            }
        })

        return this.historial;
    }

    get paramsMapbox(){
        return {
            'access_token':process.env.MAPBOX_KEY,
            'limit':5,
            'language':'es'
        }
    }


    get paramsOpenWeather(){
        return {
            'lat': global.lat,
            'lon': global.lng,
            'appid':process.env.OPENWEATHER_KEY,
            'units':'metric',
            'lang':'es'
        }
    }

    async ciudad( lugar='' ){
        //console.log('ciudad',lugar);

        try{
            const instance = axios.create({
                baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();

            //const resp = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/medellin.json?access_token=pk.eyJ1IjoiY2FybG9zZ2lyYWxkbzEyMyIsImEiOiJja3Bvc2xucDMwMml4MnB0Z29xaHd2YWhhIn0.xozA40vhk5iLTa4bfMrbfw&limit=5&language=es');

            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng:lugar.center[0],
                lat:lugar.center[1]
            }));

        } catch(error){
            return [];
        }
    }

    async clima(lat,lng){
        try{
            global.lat = lat;
            global.lng = lng;

            const instance2 = axios.create({
                baseURL:`https://api.openweathermap.org/data/2.5/weather`,
                params: this.paramsOpenWeather
            });

            const resp2 = await instance2.get();
            //console.log(resp2.data.weather[0].description);

            return {
                desc: resp2.data.weather[0].description,
                min: resp2.data.main.temp_min,
                max: resp2.data.main.temp_max,
                temp: resp2.data.main.temp
            };

        } catch(error){
            return error;
        }
    }


    agregarHistorial(lugar = '') {

        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }

        this.historial = this.historial.splice(0,5);

        this.historial.unshift( lugar.toLocaleLowerCase() );

        this.guardarDB();
    } 

    guardarDB() {
        const payload = {
            historial: this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB(){
        if(!fs.existsSync(this.dbPath)){
            return null
        }
        const info = fs.readFileSync(this.dbPath,{encoding: 'utf-8'});
        const data = JSON.parse(info);

        this.historial = data.historial;
    }


}

module.exports = Busquedas;