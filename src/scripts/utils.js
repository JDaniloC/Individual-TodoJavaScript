/*
(A) #FF432B
(B) #E8BA1C
(C) #691CE8
(D) #43FF40
*/

/*
 * (3) Filtragem:
 *      (a) - Prioridade
 *      (b) - Contexto
 *      (c) - Projeto
 * (4) Salvar o todo.txt
 */

export default function conversorDeTexto(listaDeString) {
    /* (1)
     * Recebe o texto do arquivo, quebra em linhas
     * e devolve organizado e ordenado.
     */
    return ordenar(organizar(listaDeString))
}

function ordenar(lista) {
    /*  -> Ordena os itens de acordo com a prioridade/data/hora,
     * onde os mais recentes aparecererão primeiro.
     * 1 - Verifica aqueles sem prioridade e adiciona numa lista.
     *  1.1 - Aqueles sem data e adiciona numa lista.
     *  1.2 - E aqueles sem hora, adiciona em outra lista.
     * 2 - Ordena de acordo com a maior prioridade A > Z.
     *  2.1 - Os com data, onde os mais recentes vem primeiro.
     *  2.2 - Ordena os sem data de acordo com a hora.
     * 3 - Cria uma nova lista ordenada do formato: 
     *  (comPrioridade)(comData)(semData)(semHora)
     * 
     * Param comData = Lista de tarefas.
     * return: Lista ordenada de tarefas.
     */
    var comData = []
    var comHora = []
    var semHora = []
    for (var i = 0; i < lista.length; i++) {
        if (lista[i][1][2] == "") {
            if (lista[i][1][0] != '') {
                comData.push(...lista.splice(i, 1))
            } else if (lista[i][1][1] != '') {
                comHora.push(...lista.splice(i, 1))
            } else {
                semHora.push(...lista.splice(i, 1))
            }
            i--
        }
    }
    quicksort(lista, (tarefa) => {
        var prioridade = tarefa[1][2]
        return ord(prioridade[1])
    }, (x, y, inverso) => { return (inverso) ? x > y : x < y })
    quicksort(comData, dataInverso, (x, y, inverso) => { 
        return (inverso) ? x < y : x > y 
    })
    quicksort(comHora, (tarefa) => {
        var hora = tarefa[1][1]
        return parseInt(hora)
    }, (x, y, inverso) => { return (inverso) ? x < y : x > y })
    return [...lista, ...comData, ...comHora, ...semHora]
}

function organizar(lista) {
    /*
     * -> Devolve uma lista de listas com as informações das atividades organizadas.
     * lista: Uma lista de strings representando as atividades.
     *
     * Transforma as prioridades em maiúsculas e aceita mais de um projeto/descricao.
     * 
     * Return: Devolve uma lista de strings do formato
     *  [descricao,[data, hora, prioridade, contexto, projeto]]
    */
    var resultado = []
    lista.forEach(linhas => {
        var data= ''
        var hora = ''
        var prioridade = ''
        var contextoProjeto = []

        var task = linhas.split(' ')
        if (dataValida(task[0])) {
            data  = task.shift()
        }
        if (horaValida(task[0])) {
            hora = task.shift()
        }
        if (prioridadeValida(task[0])) {
            prioridade = task.shift().toUpperCase()
        }
        
        while (task.length != 0 && (projetoValido(task[task.length - 1]) || contextoValido(task[task.length - 1]))) {
            contextoProjeto.push(task.pop().trim())
        }

        resultado = [...resultado, [task.join(' '), [data, hora, prioridade, ...contextoProjeto]]]
    }); 
    return resultado
}

function dataValida(string) {
    /* -> Recebe uma string e verifica se tem exatamente oito caracteres;
     * Se tao todos digitos e se os dois primeiros correspondem a um dia valido;
     * Se o terceiro e o quarto correspondem a um mes valido e 
     * se os quatro ultimos correspondem a um ano valido. 
     * Checa tambem se o dia e o mes fazem sentido juntos 
     * (se o dia poderia ocorrer naquele mes).
     * Alem de verificar se o mes e um numero entre 1 e 12.
     * Para fevereiro, considera que pode haver ate 29 dias, 
     * sem se preocupar se o ano e bissexto ou nao. 
     * Param data = String do formato DDMMAAAA, apenas numeros.
     * Return: Se todas as verificacoes passarem, devolve True. 
     * Caso contrario, False.
     */
    string = string.trim()
    if (string.length == 8 && soDigitos(string)) {
        const dia = parseInt(string.slice(0, 2))
        const mes = parseInt(string.slice(2, 4))
        if (mes == 2 && dia < 30) {
            return true
        } else {
            if (mes < 8 && ((mes % 2 != 0 && dia < 32) ||
                (mes % 2 == 0 && dia < 31)
                )) {
                return true
            } else if (mes < 13 && ((mes % 2 != 0 && dia < 31) || 
                (mes % 2 == 0 && dia < 32)
                )) {
                return true
            }
        }
    }
    return false
}
function horaValida(string) {
    /* -> Recebe uma string e verifica se ela tem exatamente quatro caracteres; 
     * Se tao todos digitos, se os dois primeiros formam um numero entre 00 e 23;
     * Se os dois ultimos formam um numero inteiro entre 00 e 59. 
  
     * Param horaMin = String do formato HHMM, apenas numeros.
     * Return: Se tudo isso for verdade, ela devolve True. Caso contrario, False. 
     */
    if (string != undefined) {
        string = string.trim()
        if (string.length == 4 && soDigitos(string) && 
            parseInt(string.slice(0, 2)) < 24 
            && parseInt(string.slice(2)) < 60) {
            return true
        }
    }
    return false
}
function prioridadeValida(string) {
    /*
     * -> Recebe uma string e verifica se tem exatamente tres caracteres;
     * Se o primeiro eh ‘(’, se o terceiro eh ‘)’ e se o segundo eh uma letra 
     * entre A e Z. 
     * Funcionar tanto para letras minusculas quanto maiusculas. 
     *
     * Param string = String, do formato '(S)', onde S = A-Z maiusculo ou minusculo.
     * Return: Devolve true se as verificacoes passarem e false caso contrario.
     */
    if (string != undefined && string.trim().length == 3 &&
        string[0] + string[2] == '()' && 
        ((ord('z') >= ord(string[1]) && ord(string[1]) >= ord('a')) || 
        (ord('A') <= ord(string[1]) && ord(string[1]) <= ord('Z')))
        ) {
        return true
    }
    return false
}
function contextoValido(string) {
    /* -> Recebe uma string e verifica se tem pelo menos dois caracteres 
     * e se o primeiro eh ‘@’. 
     *
     * Param string = String, do formato @String.
     * Return: Devolve True se as verificacoes passarem e False caso contrario.
     */
    if (string.length > 1 && string[0] == '@') {
        return true
    }
    return false
}
function projetoValido(string) {
    /* -> Recebe uma string e verifica se tem pelo menos dois caracteres 
     * e se o primeiro eh ‘+’. 
     *
     * Param string = String, do formato +String.
     * Return: Devolve True se as verificacoes passarem e False caso contrario.
     */
    if (string.length > 1 && string[0] == '+') {
        return true
    }
    return false
}

function ord(str) {
    return str.charCodeAt(0);
}
function soDigitos(str) {
    for (var i in str) {
        if (ord(str[i]) <= ord('9') && ord(str[i]) >= ord('0')) {
            return true
        }
    }
    return false
}
function dataInverso(tarefa) {
    /* -> Inverte a data para poder comparar qual a maior.
     * Param data = String, do formato DDMMAAA.
     * return: String da data invertida.
     */
    var data = tarefa[1][0]
    data = parseInt(data.slice(4) + data.slice(2, 4) + data.slice(0, 2))
    return data
}
const quicksort = (lista, funcao, comparacao) => {
    /* Quicksort, que recebe uma função para determinar qual é
     * o maior, e a comparacao serve para dizer se é > ou <
     */
    function swap(lista, x, y) {
        var aux = lista[x]
        lista[x] = lista[y]
        lista[y] = aux
    }
    function parte(lista, x, y) {
        var pivo = lista[Math.floor((x + y) / 2)]
        
        while (x <= y) {
            while (comparacao(funcao(lista[x]), funcao(pivo), false)) {
                x++
            }
            while (comparacao(funcao(lista[y]), funcao(pivo), true)) {
                y--
            }
            if (x <= y) {
                swap(lista, x, y)
                x++
                y--
            }
        }

        return x
    }
    function sort(lista, esquerda, direita) {
        if (lista.length > 1) {
            var indice = parte(lista, esquerda, direita)
            
            if (indice - 1 > esquerda) {
                sort(lista, esquerda, indice - 1)
            }
            if (indice < direita) {
                sort(lista, indice, direita)
            }
        }
    }
    sort(lista, 0, lista.length - 1)
}