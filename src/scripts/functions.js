import conversorDeTexto from './utils.js';

let reader = new FileReader()
var listaDeTarefas = []
let listaDePrioridades = {}
let listaDeContextos = {}
let listaDeProjetos = {}
const intensidade = 40

// Verificar o deletar (parece está deletando o errado) e parar de filtrar

window.abrirBarra = function abrirBarra() {
    // Abre/fecha a barra de navegação
    const barra = document.querySelector('.barra')

    if (barra.style.width == '') { barra.style.width = '0em'}
    barra.style.width = (barra.style.width == '0em') ? '15em' : '0em'
}

window.download = function download() {
    // Faz o download do txt
    var anchor = document.querySelector('#aDownload')
    var arquivo = new Blob(listaDeTarefas.map(tarefa => { 
        return tarefa + '\n'
    }), {type: 'txt'})
    
    anchor.href = URL.createObjectURL(arquivo)
    anchor.download = 'Todo.txt'
}

window.dragOver = function dragOver(evt) {
    // Se não colocar isso fica como bloqueado
    evt.preventDefault()
}

window.drop = function drop(evt) {
    // Para carregar o arquivo
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

window.adicionarTarefa = function adicionarTarefa() {
    /* Adiciona uma tarefa na listaDeTarefa e 
     * Pede pra reorganizar e rendereza-la
     */
    let tarefa = document.querySelector('#entrada')
    listaDeTarefas = [...listaDeTarefas, tarefa.value]
    render()
}

window.salvarTarefa =  function salvarTarefa() {
    /* Modifica a tarefa com o novo resultado
     * Esconde a tela de editar
     */
    var indice = listaDeTarefas.indexOf(window.default)
    listaDeTarefas[indice] = document.querySelector('#entradaEditar').value
    render()

    document.querySelector('.app').style.opacity = '100%'
    document.querySelector('.editar').style.visibility = 'hidden'
}

function editarTarefa(lista, indice) {
    /* Exibe a tela de editar com o texto da tarefa 
     * indicada pelo indice
     * Salva o indice no window.selecionado
     */
    window.default = lista[indice]

    document.querySelector('.app').style.opacity = '20%'
    document.querySelector('.editar').style.visibility = 'visible'

    const entrada = document.querySelector('#entradaEditar')
    entrada.value = lista[indice]
}
function removerTarefa(lista, indice) {
    // Remove e renderiza sem a tarefa
    var index = listaDeTarefas.indexOf(lista[parseInt(indice)])
    listaDeTarefas.splice(index, 1)
    render()
}

function filtrar(funcionalidade, filtro) {
    let lista;
    switch (funcionalidade) {
        case "projetos":
            lista = listaDeProjetos[filtro] 
            break;
        case "contextos":
            lista = listaDeContextos[filtro] 
            break;
        default:
            lista = listaDePrioridades[filtro] 
            break;
    }
    listar(lista, false)
}

function adicionarBotao(id, novo) {
    /* (4)
     * Recebe o ID e uma nova informação
     * e adiciona uma nova Li na Ul da ID
     */
    const contexto = document.querySelector(`#${id}`)
    var novaLinha = document.createElement('button')

    novaLinha.style.flex = 'auto'
    novaLinha.addEventListener('click', () => {
        filtrar(id, novo)
    })
    novaLinha.innerHTML = novo

    contexto.appendChild(novaLinha)
}

function adicionaLinhaTarefas(lista, texto) {
    /* (3)
     * Recebe uma linha do formato:
     *  (descricao,(data, hora, prioridade, contexto, projeto))
     * Cria uma nova linha e adiciona cor.
     */
    var tarefas = document.getElementsByClassName('tarefas')[0]
    var novaLinha = document.createElement("li")

    var tarefa = texto[1].slice(0, 3).filter((string) => {
            return string != ''
        }).join(' ') + 
        " " + texto[0] + " " + 
        texto[1].slice(3).join(' ')
    novaLinha.innerHTML = tarefa
    novaLinha.style.overflowWrap = 'break-word'
    lista.push(tarefa)

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

    return tarefa
}

function atualizarFuncionalidades() {
    /* Percorre as listas de prioridade/contexto/projetos
     * E adiciona as linhas respectivamente
     */
    document.querySelector('#prioridades').innerText = ''
    Object.keys(listaDePrioridades).forEach(prioridade => {
        adicionarBotao('prioridades', prioridade)
    })
    
    
    document.querySelector('#contextos').innerText = ''
    Object.keys(listaDeContextos).forEach(contexto => {
        adicionarBotao('contextos', contexto)
    });


    document.querySelector('#projetos').innerText = ''
    Object.keys(listaDeProjetos).forEach(projeto => {
        adicionarBotao('projetos', projeto)
    });

}

function adicionarBotoes(lista, indice) {
    /* Cria um botão de editar e deletar
     * E devolve um div com ambos.
     */
    var div = document.createElement('div')
    div.id = 'divTarefa'

    var deletar = document.createElement('button')
    deletar.innerText = "Del"
    deletar.id = 'buttonTarefa'
    deletar.value = indice
    deletar.addEventListener('click', (evt) => {
        removerTarefa(lista, evt.target.value)
    })

    var editar = document.createElement('button')
    editar.innerHTML = "Edit"
    editar.id = 'buttonTarefa'
    editar.value = indice
    editar.addEventListener('click', (evt) => {
        editarTarefa(lista, evt.target.value)
    })

    div.appendChild(deletar)
    div.appendChild(editar)
    
    return div
}

function mapearFuncionalidades(tarefa, linha) {
    /*
     * Adiciona a tarefa na lista de 
     * prioridade/projeto/contexto
     */
    if (linha[1][2] != '') {
        if (!listaDePrioridades.hasOwnProperty(linha[1][2])) {
            listaDePrioridades[linha[1][2]] = []
        }
        listaDePrioridades[linha[1][2]].push(tarefa)
    }

    linha[1].slice(3).forEach(string => {
        if (string != '') {
            if (string[0] == "+") {
                if (!listaDeProjetos.hasOwnProperty(string)) {
                    listaDeProjetos[string] = []
                }
                listaDeProjetos[string].push(tarefa)
            } else if (string[0] == "@") {
                if (!listaDeContextos.hasOwnProperty(string)) {
                    listaDeContextos[string] = []
                }
                listaDeContextos[string].push(tarefa)
            } 
            
        }
    });
}

function listar(lista, mapear) {
    /* Reseta a lista de tarefas
     * converte a lista recebida
     * e para cada elemento adiciona a tarefa
     * devolve a lista ordenada
     */
    document.querySelector('.tarefas').innerText = ''
    let tasks = conversorDeTexto(lista)

    lista = []

    tasks.map(linha => {
        if (linha[0] != '') {
            var tarefa = adicionaLinhaTarefas(lista, linha)
            
            if (mapear) {
                mapearFuncionalidades(tarefa, linha)
            }

            document.querySelector('.tarefas').lastChild.appendChild(adicionarBotoes(lista, tasks.indexOf(linha)))
        }
    });

    return lista
}

function render() {
    /* (2)
     * Limpa todas as tarefas,
     * Organiza e ordena as tarefas do listaDeTarefas 
     * Zera o listaDeTarefas para ser ordenado também
     */
    listaDeContextos = {}
    listaDeProjetos = {}
    listaDePrioridades = {}

    listaDeTarefas = listar(listaDeTarefas, true)
    
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
