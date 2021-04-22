const { leerInput } = require("./helpers/inquirer")

const main = async() => {
    const texto = await leerInput('Ingrese algo: ');

    console.log(texto);
}

main();