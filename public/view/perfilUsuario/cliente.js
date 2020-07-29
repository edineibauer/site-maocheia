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
        cliente.avaliacao = getProfissionalStar(cliente.avaliacao/10000000);
        cliente.avaliacao.avaliacao = parseFloat(cliente.avaliacao.avaliacao).toFixed(1).replace(".", ",");
        let tpl = await getTemplates();

        $("#perfil-cliente").html(Mustache.render(tpl.cliente, cliente));

        /**
         * Read avaliações
         */
        let feedbacks = [];
        let avaliacoes = await getJSON(HOME + "app/find/avaliacao/profissional/" + cliente.id);
        if (avaliacoes.response === 1 && !isEmpty(avaliacoes.data) && !isEmpty(avaliacoes.data.avaliacao)) {
            if (avaliacoes.data.avaliacao.length > 5)
                $("#section-avaliacoes-more").removeClass("hide");

            for (let aval of avaliacoes.data.avaliacao.slice(0, 5)) {
                let d = aval.data.split(" ")[0].split("-");
                aval.imagem_do_cliente = (!isEmpty(aval.imagem_do_cliente) ? aval.imagem_do_cliente : HOME + "assetsPublic/img/favicon.png?v=" + VERSION);
                aval.data = d[2] + "/" + d[1] + "/" + d[0];
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