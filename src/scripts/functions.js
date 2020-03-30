// GAMBIARRA
load()
var utils;
async function load() {
    utils = await import('./utils.js');
}

let reader = new FileReader()
reader.onloadend = function() {
    var lista = utils.conversorDeTexto(reader.result)
    lista.forEach(linha => {
        adicionaLinha(linha)
    });
}

function abrirArquivo(entrada) {
    var path = entrada.target.files[0]

    reader.readAsText(path)
}

function adicionaLinha(texto) {
    var lista = document.getElementsByClassName('lista')[0]
    var novaLinha = document.createElement("LI")

    novaLinha.innerHTML = texto
    switch (texto[0]) {
        case 'A':
            novaLinha.style.backgroundColor = '#FF432B'
            break
        case 'B':
            novaLinha.style.backgroundColor = '#E8BA1C'
            break
        case 'C':
            novaLinha.style.backgroundColor = '#691CE8'
            break
        case 'D':
            novaLinha.style.backgroundColor = '#43FF40'
            break
    }
    lista.appendChild(novaLinha)
}