const { inquirerMenu, pausa, leerInput, listadoTareasBorrar, confirmar ,mostrarListadoChecklist} = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async() => {
    
    const busquedas = new Busquedas();
    let opt;


    do {
        opt = await inquirerMenu();
        
        switch (opt) {
            case 1:
                // mostrar mensaje
                const lugar = await leerInput('Escriba una ciudad por favor: ');
                console.log(lugar);

                // buscar lugares

                // seleccionar lugar

                // Clima

                // mostrar resultado
                // console.clear();
                console.log('\n Info de ciudad  \n'.bgGreen.black);
                console.log('Ciudad: ');
                console.log('Latitus: ');
                console.log('Longitud: ');
                console.log('Temperatura: ');
                console.log('Minima: ');
                break;

            case 2:
                
                break;
     
        }
     

        if (opt !== 0) await pausa();
    } while (opt !== 0);
}

main();