var profissional = history.state.param.url[0];

if (USER.setorData.id == profissional) {
    toast("Você não pode avaliar seu próprio perfil", "toast-info", 3000);
    setTimeout(function () {
        history.back();
    }, 500);

} else {
    exeRead("avaliacao", {"cliente": USER.setorData.id, "profissional": profissional}).then(result => {
        if (!isEmpty(result)) {
            toast("profissional já avaliado!", 3000, "toast-infor");
            setTimeout(function () {
                history.back();
            }, 500);
        } else {

            if (!isNumberPositive(profissional)) {
                toast("id do profissional precisa ser um número", "toast-error", 2000);
                setTimeout(function () {
                    history.back();
                }, 500);
            } else {

                exeRead("clientes", profissional).then(p => {
                    if (isEmpty(p)) {
                        toast("Profissional não encontrado", "toast-error", 2000);
                        setTimeout(function () {
                            history.back();
                        }, 500);
                    } else {

                        /**
                         * Tudo certo, bora avaliar
                         */
                        $("#avaliacao-title").html("<small>avaliação</small> " + p.nome);
                        $(document).ready(function () {
                            $("#enviar").off("click").on("click", function () {
                                let dados = {
                                    "qualidade": parseInt($('input[name=ql]:checked').val()),
                                    "preco_justo": parseInt($('input[name=pj]:checked').val()),
                                    "atendimento": parseInt($('input[name=at]:checked').val()),
                                    "comentario": $("#comentario").val(),
                                    "profissional": profissional,
                                    "cliente": parseInt(USER.setorData.id),
                                    "data": moment().format("YYYY-MM-DD HH:mm:ss"),
                                    "nome_do_cliente": USER.nome,
                                    "imagem_do_cliente": (!isEmpty(USER.setorData.imagem) ? JSON.parse(USER.setorData.imagem)[0].url : !isEmpty(USER.imagem) ? USER.imagem.url : !isEmpty(USER.setorData.perfil_profissional) ? JSON.parse(USER.setorData.perfil_profissional)[0].imagem_de_perfil[0].url : "")
                                };

                                if (isEmpty(dados.atendimento) || !isNumberPositive(dados.atendimento)) {
                                    toast("Avalie o atendimento", 2000, "toast-infor");
                                } else if (isEmpty(dados.qualidade) || !isNumberPositive(dados.qualidade)) {
                                    toast("Avalie a qualidade", 2000, "toast-infor");
                                } else if (isEmpty(dados.preco_justo) || !isNumberPositive(dados.preco_justo)) {
                                    toast("Avalie o valor cobrado", 2000, "toast-infor");
                                } else {

                                    db.exeCreate("avaliacao", dados).then(result => {
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
    });
}