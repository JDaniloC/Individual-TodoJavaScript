import conversorDeTexto from './utils.js';

let reader = new FileReader()
var listaDePrioridades = []
var listaDeContextos = []
var listaDeProjetos = []
const intensidade = 40

window.dragOver = function dragOver(evt) {
    evt.preventDefault()
}
window.drop = function drop(evt) {
    /* Para carregar o arquivo
     */
    evt.preventDefault()
    var file = evt.dataTransfer.files[0]
    
    if (file == undefined) {
        var result = conversorDeTexto(evt.dataTransfer.getData('text'))

        result.forEach(item => {
            adicionaLinhaTarefas(item)
        });
    } else {
        reader.readAsText(file)
    }
}

function adicionarLinha(id, novo) {
    /* (4)
     * Recebe o ID e uma nova informação
     * e adiciona uma nova Li na Ul da ID
     */
    const contexto = document.querySelector(`#${id}`)
    var novaLinha = document.createElement('li')

    novaLinha.innerHTML = novo

    contexto.appendChild(novaLinha)
}

function adicionaLinhaTarefas(texto) {
    /* (3)
     * Recebe uma linha do formato:
     *      (descricao,(data, hora, prioridade, contexto, projeto))
     * Cria uma nova linha e adiciona cor.
     */
    var tarefas = document.getElementsByClassName('tarefas')[0]
    var novaLinha = document.createElement("LI")

    novaLinha.innerHTML = texto[1].slice(0, 3).join(' ') + 
        " " + texto[0].join(' ') + " " + texto[1].slice(3).join(' ')

    if (texto[1][2] != '' && listaDePrioridades.indexOf(texto[1][2]) == -1) {
        listaDePrioridades.push(texto[1][2])
    }

    texto[1].slice(3).forEach(string => {
        if (string != '') {
            if (string[0] == "+"
                && listaDeProjetos.indexOf(string) == -1) {
                listaDeProjetos.push(string)
            } else if (string[0] == "@"
                && listaDeContextos.indexOf(string) == -1) {
                listaDeContextos.push(string)
            } 
        }
    });

    switch (texto[1][2]) {
        case '(A)':
            novaLinha.style.backgroundImage = `linear-gradient(to right, #FF2212 0%, #FFF ${intensidade}%)`
            break
        case '(B)':
            novaLinha.style.backgroundImage = `linear-gradient(to right, #EBDD19 0%, #FFF ${intensidade}%)`
            break
        case '(C)':
            novaLinha.style.backgroundImage = `linear-gradient(to right, #053AE8 0%, #FFF ${intensidade}%)`
            break
        case '(D)':
            novaLinha.style.backgroundImage = `linear-gradient(to right, #37FF05 0%, #FFF ${intensidade}%)`
            break
    }
    tarefas.appendChild(novaLinha)
}

reader.onloadend = function() {
    /* (2)
     * Ao terminar a leitura, ele vai converter
     * o texto, e para cada linha entrará no 
     * adicionarLinha.
     */
    var listaDeTarefas = conversorDeTexto(reader.result)

    var lenPrioridades = listaDePrioridades.length
    var lenContextos = listaDeContextos.length
    var lenProjetos = listaDeProjetos.length

    listaDeTarefas.forEach(linha => {
        if (linha[0] != '') {
            adicionaLinhaTarefas(linha)
        }
    });
    if (lenPrioridades < listaDePrioridades.length) {
        listaDePrioridades.forEach(prioridade => {
            adicionarLinha('prioridades', prioridade)
        })
    }
    if (lenContextos < listaDeContextos.length) {
        listaDeContextos.forEach(contexto => {
            adicionarLinha('contextos', contexto)
        });
    }
    if (lenProjetos < listaDeProjetos.length) {
        listaDeProjetos.forEach(projeto => {
            adicionarLinha('projetos', projeto)
        });
    }
}

window.abrirArquivo = function abrirArquivo(entrada) {
    /*
     * (1) 
     * Ele recebe o evento, que tem o arquivo dentro, 
     * e envia para o reader.
     */
    var file = entrada.target.files[0]
    
    reader.readAsText(file)
}