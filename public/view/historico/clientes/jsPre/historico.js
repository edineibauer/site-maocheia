function historicoFuncao(data) {
    for(let historico of data) {
        historico.atendido = historico.atendido == 1;
        historico.data = moment(historico.data).calendar().toLowerCase();
    }

    return data;
}