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

const getRentPrices = async () => {
    const url = 'https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/59057?nult=10';
    try {
        const data = await getData(url);
        //Filtrem les dades per obtenir només les que contenen "Nombre: Catalunya"
        const catalunya = data.filter((element) => element.Nombre.includes('Cataluña. Total'));
        return catalunya;
    } catch (error) {
        console.error('Error:', error);
        return [];
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
    //Fem la peticio a la API de l'IPC
    const url = 'https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/59057?nult=10';
    try {
        const data = await getData(url);
        //obtinc la referencia al meu selector a traves del DOM
        const select = document.getElementById('ipc-selector');

        data.forEach((element) => {
            //Creo un element option per cada element de la llista
            const option = document.createElement('option');
            //Separo el nom de l'element per poder mostrar-lo
            const nameParts = element.Nombre.split('.');
            
            const nameAfterFirtsDot = nameParts.slice(1).join('.');

            // console.log(nameAfterFirtsDot);
            option.value = nameAfterFirtsDot;
            option.text = nameAfterFirtsDot;
            select.appendChild(option);
        });
        return data;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

const showIPC = async () => {
    
    try {
        const data = await getIPC();
        const select = document.getElementById('ipc-selector');
        const IPCselected = select.value;
        let filteredData = data.find((element) => element.Nombre.includes(IPCselected));
        console.log(filteredData);
        //em  creo les dues array on afegire la llegenda els valors
        const labels = [];
        const values = [];

        //recorro les dades per obtenir els valors i les dates
        filteredData.Data.forEach((item) => {
            labels.push(item.Anyo);
            values.push(item.Valor);
        });

        labels.reverse();
        values.reverse();
        myChart(labels, values);
    } catch (error) {
        
    }
}

let chart = null; // Declarem una variable global per a guardar el gràfic

const myChart = (labels, data) => {
    const ctx = document.getElementById('myChart').getContext('2d');
    if (chart) {
        chart.destroy();
    }
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'IPC',
                data: data,
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

main = async () => {
    try {
        const data = await getRentPrices();
        showRentPrices(data);
        showIPC();

        const select = document.getElementById('ipc-selector');
        select.addEventListener('change', showIPC);
    } catch (error) {
        console.error('Error:', error);
        throw error;        
    }
}

main();