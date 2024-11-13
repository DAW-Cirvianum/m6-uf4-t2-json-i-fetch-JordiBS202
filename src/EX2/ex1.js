const getData = async (url) => {
    try {
        // Obtenim les dades de la URL
        const response = await fetch(url);
        // Si la resposta no és correcta, llancem un error
        if (!response.ok) {
            throw new Error(`HTTP errror! status: ${response.status}`);
        }
        //ens falta convertir la resposta a JSON
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};

const getRentPrices = async () => { const url = 'https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/59057?nult=10'; 
    try { const data = await getData(url); 
        // Filtrar les dades per obtenir només les que contenen "Nombre: Catalunya" 
        const catalunya = data.filter((element) => element.Nombre.includes('Cataluña. Total')); 
        // Extreure només els valors dels atributs dins de Data 
        /*const valors = catalunya.map((element) => { return element.Data.map((item) => item.Valor); }); 
        return valors;*/
        
        return catalunya;
    } catch (error) { 
     console.error('Error:', error);  return[]; 
    } 
};
getRentPrices().then((rebo) => console.log(rebo));

const showRentPrices = (data) => {
    //obtenim els divs de la seccio on afegir les dades
    const divs = document.querySelectorAll('.contenidor > div');

    //creem els elements de llista
    const ulElementVariacio = document.createElement('ul');
    const ulElementIndex = document.createElement('ul');

    //comencem la logica recursiva per poder mostrar les dedes necesaries
    data.forEach((element) => {
        element.Data.forEach((item) => {
            const liElement = document.createElement('li');
        if (element.Nombre.includes('Índice')) {
            //Afegir el contigut a cada element
            liElement.innerHTML = `<br>${item.Anyo} - ${item.Valor}</br>`;
            //Afegir el element li al div corresponent
            ulElementIndex.appendChild(liElement);
        } else if (element.Nombre.includes('Variación')) {
            //Afegir el contigut a cada element
            liElement.innerHTML = `<br>${item.Anyo} - ${item.Valor}</br>`;
            //Afegir el element li al div corresponent
            ulElementVariacio.appendChild(liElement);
        }

        });
        
    });

    //Afegir els elements ul al div corresponent
    divs[0].appendChild(ulElementIndex); 
    divs[1].appendChild(ulElementVariacio);
};

const getIPC = async () => {
    
}

const showIPC = async () => {
}

let chart = null; // Declarem una variable global per a guardar el gràfic

const myChart = () => {
}

main = async () => {
    try {
        const data = await getRentPrices();
        showRentPrices(data);
    } catch (error) {
        console.error('Error:', error);
        throw error;        
    }
}

main();