import conversorDeTexto from './utils.js';

let reader = new FileReader()
var listaDeTarefas = []
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

function removerTarefa(indice) {
    // Remove e renderiza sem a tarefa
    listaDeTarefas.splice(parseInt(indice), 1)
    render()
}
function editarTarefa(indice) {
    /* Exibe a tela de editar com o texto da tarefa 
     * indicada pelo indice
     * Salva o indice no window.selecionado
     */
    var tarefa = listaDeTarefas[indice]

    window.selecionado = indice
    document.querySelector('.app').style.opacity = '20%'
    document.querySelector('.editar').style.visibility = 'visible'

    const entrada = document.querySelector('#entradaEditar')
    entrada.value = tarefa
}

window.salvarTarefa =  function salvarTarefa() {
    /* Modifica a tarefa com o novo resultado
     * Esconde a tela de editar
     */
    listaDeTarefas[window.selecionado] = document.querySelector('#entradaEditar').value
    render()

    document.querySelector('.app').style.opacity = '100%'
    document.querySelector('.editar').style.visibility = 'hidden'
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
     *  (descricao,(data, hora, prioridade, contexto, projeto))
     * Cria uma nova linha e adiciona cor.
     */
    var tarefas = document.getElementsByClassName('tarefas')[0]
    var novaLinha = document.createElement("li")

    novaLinha.innerHTML = texto[1].slice(0, 3).join(' ') + 
        " " + texto[0] + " " + texto[1].slice(3).join(' ')
    listaDeTarefas.push(novaLinha.innerHTML.trim())

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
            novaLinha.style.backgroundImage = `linear-gradient(to right, #37FF05 0%, #FFF ${intensidade}%)`
            break
        case '(D)':
            novaLinha.style.backgroundImage = `linear-gradient(to right, #053AE8 0%, #FFF ${intensidade}%)`
            break
    }
    tarefas.appendChild(novaLinha)
}

function atualizarFuncionalidades() {
    /* Percorre as listas de prioridade/contexto/projetos
     * E adiciona as linhas respectivamente
     */
    document.querySelector('#prioridades').innerText = ''
    listaDePrioridades.forEach(prioridade => {
        adicionarLinha('prioridades', prioridade)
    })
    
    
    document.querySelector('#contextos').innerText = ''
    listaDeContextos.forEach(contexto => {
        adicionarLinha('contextos', contexto)
    });


    document.querySelector('#projetos').innerText = ''
    listaDeProjetos.forEach(projeto => {
        adicionarLinha('projetos', projeto)
    });

}

function adicionarBotoes(indice) {
    /* Cria um botão de editar e deletar
     * E devolve um div com ambos.
     */
    var div = document.createElement('div')

    var deletar = document.createElement('button')
    deletar.innerText = "Del"
    deletar.id = 'buttonTarefa'
    deletar.value = indice
    deletar.addEventListener('click', (evt) => {
        removerTarefa(evt.target.value)
    })

    var editar = document.createElement('button')
    editar.innerHTML = "Edit"
    editar.id = 'buttonTarefa'
    editar.value = indice
    editar.addEventListener('click', (evt) => {
        editarTarefa(evt.target.value)
    })

    div.appendChild(deletar)
    div.appendChild(editar)
    
    return div
}

function render() {
    /* (2)
     * Limpa todas as tarefas,
     * Organiza e ordena as tarefas do listaDeTarefas 
     * Zera o listaDeTarefas para ser ordenado também
     */
    const tarefas = document.querySelector('.tarefas')
    tarefas.innerText = ''
    let tasks = conversorDeTexto(listaDeTarefas)

    listaDeTarefas = []
    listaDeContextos = []
    listaDeProjetos = []
    listaDePrioridades = []

    var indice = 0
    tasks.forEach(linha => {
        if (linha[0] != '') {
            adicionaLinhaTarefas(linha)

            document.querySelector('.tarefas').lastChild.appendChild(adicionarBotoes(indice))

            indice++
        }
    });
    atualizarFuncionalidades()
}

reader.onloadend = function() {
    // Ao terminar a leitura ele irá realizar o listar
    listaDeTarefas = [...listaDeTarefas, ...reader.result.split('\n')]
    render()
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

window.adicionarTarefa = function adicionarTarefa() {
    let tarefa = document.querySelector('#entrada')
    listaDeTarefas = [...listaDeTarefas, tarefa.value]
    render()
}