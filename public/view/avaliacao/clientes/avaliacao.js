var profissional = history.state.param.url[0], avaliacao;

if (USER.setorData.id == profissional) {
    toast("Você não pode avaliar seu próprio perfil", "toast-info", 3000);
    setTimeout(function () {
        history.back();
    }, 500);

} else {
    db.exeRead("avaliacao_prof", {"profissional": profissional}).then(result => {
        if (!isEmpty(result)) {
            for (let r of result) {
                if (r.relationData.autorpub.id == USER.id) {
                    avaliacao = r;
                    break;
                }
            }
        }
    });

    if (!isNumberPositive(profissional)) {
        toast("id do profissional precisa ser um número", "toast-error", 2000);
        setTimeout(function () {
            history.back();
        }, 500);
    } else {

        db.exeRead("clientes", profissional).then(p => {
            if (isEmpty(p)) {
                toast("Profissional não encontrado", "toast-error", 2000);
                setTimeout(function () {
                    history.back();
                }, 500);
            } else {
                p = p[0];

                /**
                 * Tudo certo, bora avaliar
                 */
                $("#avaliacao-title").html("<small>avaliação</small> " + p.nome);
                $(document).ready(function () {
                    $("#enviar").off("click").on("click", function () {
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

                            db.exeCreate("avaliacao_prof", dados).then(result => {
                                if (!isEmpty(result)) {
                                    toast("Obrigado, a sua avaliação foi enviada!", "toast-success", 2500);
                                    setTimeout(function () {
                                        history.back();
                                    }, 500);
                                }
                            });
                        }
                    });
                });
            }
        });
    }
}