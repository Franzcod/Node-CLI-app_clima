require('dotenv').config()


const { inquirerMenu, pausa, leerInput,listarLugares} = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');



const main = async() => {
    
    const busquedas = new Busquedas();
    let opt;


    do {
        opt = await inquirerMenu();
        
        switch (opt) {
            case 1:
                // mostrar mensaje
                const termino = await leerInput('Escriba una ciudad por favor: ');
                
                // buscar lugares
                const lugares = await  busquedas.ciudad(termino);
                
                // seleccionar lugar
                const id = await listarLugares(lugares);

                if( id === '0') continue;

                

                const lugarSel = lugares.find(l => l.id === id);

                // Guardar en DB
                busquedas.agregarHistorial(lugarSel.nombre);
                
                console.log('  Buscando informacion...  '.bgMagenta.black);
                console.log('  Aguarde...  '.bgMagenta.black);
                
                // Clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);
                
                // mostrar resultado
                console.clear();
                const latitud = (lugarSel.lat).toString();
                const longitud = (lugarSel.lng).toString();
                const temp = (clima.temp).toString();
                const min = (clima.min).toString();
                const max = (clima.max).toString();
                const desc = (clima.desc).toString();


                console.log('\n:::::::::::: INFO DE CIUDAD ::::::::::::::\n'.bgCyan.black);
                console.log('Ciudad     : '.bgWhite.black + (lugarSel.nombre).bgWhite.blue);
                console.log('Latitud    : '.bgWhite.black + latitud.bgWhite.blue);
                console.log('Longitud   : '.bgWhite.black + longitud.bgWhite.blue);
                console.log('             '.bgWhite);
                console.log('Temperatura: '.bgWhite.black + temp.bgWhite.blue + '° '.bgWhite.blue);
                console.log('Minima     : '.bgWhite.black + min.bgWhite.blue + '° '.bgWhite.blue);
                console.log('Maxima     : '.bgWhite.black + max.bgWhite.blue + '° '.bgWhite.blue);
                console.log('Descripcion: '.bgWhite.black + desc.bgWhite.blue);
                break;

            case 2:
                busquedas.historial.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                });
                break;
     
        }
     

        if (opt !== 0) await pausa();
    } while (opt !== 0);
}

main();