const fs = require('fs');

const axios = require('axios');

class Busquedas {
    historial = [];
    dbPAth = './db/database.json';

    constructor(){
        // Leer DB
        this.leerDB();
    }

    get historialCapitalizado() {
        return this.historial.map( lugar => {

            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );

            return palabras.join(' ')

        })
    }

    get paramsMapbox() {
        return {
            'access_token' : process.env.MAPBOX_KEY,
            'limit' : 5,
            'language' : 'es',
        }
    }

    get paramsWeather() {
        // &appid=7f9ac19157eef39772cd7b0faf262e17&units=metric&lang=es
        return {
            'appid' : process.env.OPENWEATHER,
            'units': 'metric',
            'lang' : 'es',

        }
    }

    

    async ciudad (lugar = '') {
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });
            
            const resp = await instance.get();
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));

        } catch (error) {
            
            return [];
        } //retornar ciudad que coincidan con el ingreso de usuario
    }


    async climaLugar(lat, lon){
        try {
            // Instance axios.create()
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsWeather, lat , lon}
            });
            
            const resp = await instance.get();
            const {weather, main} = resp.data;
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp,
            };

            // resp.data
        } catch (error) {
            console.log(error);
            
        }
    }

    agregarHistorial(lugar = ''){

        if ( this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }
        this.historial = this.historial.slice(0,6);


        this.historial.unshift(lugar.toLocaleLowerCase());

        // Grabar en DB
        this.guardarDB();
    }

    guardarDB(){
        const payload = {
            historial: this.historial
        };

        fs.writeFileSync(this.dbPAth, JSON.stringify(payload));
    }

    leerDB(){
        const archivo = this.dbPAth;

        if (!fs.existsSync(archivo)){
            return;
        }
        const info = fs.readFileSync(archivo, {encoding: 'utf-8'});
        const data = JSON.parse(info);
        this.historial = data.historial;
    }
}

module.exports = Busquedas;