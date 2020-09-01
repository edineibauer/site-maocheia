var profissional = history.state.param.url[0], avaliacao;

if (USER.setorData.id == URL[0]) {
    toast("Deixe seu perfil para seus clientes avaliarem!", 3000, "toast-infor");
    history.back();
}

function enviar() {
    let dados = {
        "qualidade": parseInt($('input[name=ql]:checked').val()) * 10000000,
        "preco_justo": parseInt($('input[name=pj]:checked').val()) * 10000000,
        "atendimento": parseInt($('input[name=at]:checked').val()) * 10000000,
        "comentario": $("#comentario").val(),
        "profissional": profissional,
        "data": dateTimeFormat()
    };

    if (isEmpty(dados.atendimento) || !isNumberPositive(dados.atendimento)) {
        toast("Avalie o atendimento", 2000, "toast-infor");
    } else if (isEmpty(dados.qualidade) || !isNumberPositive(dados.qualidade)) {
        toast("Avalie a qualidade", 2000, "toast-infor");
    } else if (isEmpty(dados.preco_justo) || !isNumberPositive(dados.preco_justo)) {
        toast("Avalie o valor cobrado", 2000, "toast-infor");
    } else {

        toast("Obrigado, a sua avaliação foi enviada!", "toast-success", 2500);
        history.back();
        db.exeCreate("avaliacao_prof", dados);
    }
}