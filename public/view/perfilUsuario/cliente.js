$(function () {
    (async () => {
        let cliente = await exeRead("clientes", {"usuarios_id": history.state.param.url[0]});
        if(isEmpty(cliente)) {
            toast("usuário não encontrado", 1000, "toast-infor");
            history.back();
            return;
        } else {
            cliente = cliente[0];
        }

        cliente.home = HOME;
        cliente.imagem_url = (!isEmpty(cliente.perfil_profissional) && !isEmpty(cliente.perfil_profissional[0].imagem_de_perfil) ? cliente.perfil_profissional[0].imagem_de_perfil[0].urls.medium : (!isEmpty(cliente.imagem) ? cliente.imagem[0].urls.medium : ""));
        let avaliacao_geral = parseFloat(parseFloat((!isEmpty(cliente.perfil_profissional) ? ((cliente.perfil_profissional[0].atendimento + cliente.perfil_profissional[0].qualidade) / 2) : cliente.avaliacao) / 10000000).toFixed(1));
        cliente.avaliacao = getProfissionalStar(avaliacao_geral);
        cliente.avaliacao.avaliacao = parseFloat(cliente.avaliacao.avaliacao).toFixed(1).replace(".", ",");
        let tpl = await getTemplates();

        $("#perfil-cliente").html(Mustache.render(tpl.cliente, cliente));

        /**
         * Read avaliações
         */
        let feedbacks = [];
        let avaliacoes = await getJSON(HOME + "app/find/avaliacao/profissional/" + cliente.id);
        if (!isEmpty(avaliacoes.avaliacao)) {
            if (avaliacoes.avaliacao.length > 5)
                $("#section-avaliacoes-more").removeClass("hide");

            for (let aval of avaliacoes.avaliacao.slice(0, 5)) {
                aval.imagem_do_cliente = (!isEmpty(aval.imagem_do_cliente) ? aval.imagem_do_cliente : HOME + "assetsPublic/img/favicon.png?v=" + VERSION);
                aval.data = moment(aval.data).format("DD/MM/YYYY");
                aval.avaliacao_geral = (((!isEmpty(aval.atendimento) ? parseInt(aval.atendimento) : 10000000) + (!isEmpty(aval.qualidade) ? parseInt(aval.qualidade) : 10000000)) / 2);
                aval.star = getProfissionalStar(aval.avaliacao_geral);
                feedbacks.push(aval);
            }

        } else {
            $("#section-avaliacoes-title").html("Nenhuma avaliação").addClass("text-center");
        }

        $("#section-avaliacoes").html(Mustache.render(tpl.avaliacoes, feedbacks));
    })();
});