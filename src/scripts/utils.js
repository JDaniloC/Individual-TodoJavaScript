/*
(A) #FF432B
(B) #E8BA1C
(C) #691CE8
(D) #43FF40
*/

export function conversorDeTexto(arquivo) {
    var linhas = organizar(arquivo.split("\n"))

    return linhas
}

function organizar(lista) {
    /*
    -> Devolve uma lista de listas com as informações das atividades organizadas.
    lista: Uma lista de strings representando as atividades.

    Transforma as prioridades em maiúsculas e aceita mais de um projeto/descricao.
    
    Return: Devolve uma tupla de strings do formato (descricao,(data, hora, prioridade, contexto, projeto...))
    */
    var resultado = []
    lista.forEach(linhas => {
        data, hora, pri, desc = '', '', '', ''

        var task = linhas.split(' ')
        if (prioridadeValida(task[0])) {
            pri = task.shift().toUpperCase()
        }
        
    }); 
    return resultado
}

function dataValida() {
    return false
}
function horaValida() {
    return false
}
function prioridadeValida(node) {
    /*
    -> Recebe uma string e verifica se tem exatamente tres caracteres;
    Se o primeiro e ‘(’, se o terceiro e ‘)’ e se o segundo e uma letra entre A e Z. 
    Funcionar tanto para letras minusculas quanto maiusculas. 
    
    Param pri = String, do formato (S), onde S = A-Z maiusculo ou minusculo.
    Return: Devolve True se as verificacoes passarem e False caso contrario.
    */
    if (node.length == 3 && 
        ['(A)', '(B)', '(C)', '(D)'].includes(node.toUpperCase())
        ) {
        return true
    }
    return false
}