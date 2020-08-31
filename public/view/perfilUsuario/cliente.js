$(async function () {
    let tpl = await getTemplates();

    /**
     * Read avaliações
     */
    if(parseInt($("#profissional").val())) {
        let feedbacks = [];
        let avaliacoes = await db.exeRead("avaliacao_prof", {profissional: URL[0]});
        if (!isEmpty(avaliacoes)) {
            if (avaliacoes.length > 5)
                $("#section-avaliacoes-more").removeClass("hide");

            for (let aval of avaliacoes.slice(0, 5)) {
                let d = (aval.data.indexOf("T") > -1 ? aval.data.split("T")[0].split("-") : aval.data.split(" ")[0].split("-"));
                aval.imagem_do_cliente = (!isEmpty(aval.relationData.autorpub.imagem) ? aval.relationData.autorpub.imagem[0].urls.medium : HOME + "assetsPublic/img/favicon.png?v=" + VERSION);
                aval.data = d[2] + "/" + d[1] + "/" + d[0];
                aval.avaliacao_geral = (((!isEmpty(aval.atendimento) ? parseInt(aval.atendimento) : 10000000) + (!isEmpty(aval.qualidade) ? parseInt(aval.qualidade) : 10000000)) / 2);
                $("#avaliacaop").html(Mustache.render(tpl.profissionalStar, getProfissionalStar(aval.avaliacao_geral /10000000)));
                aval.star = getProfissionalStar(aval.avaliacao_geral /10000000);
                feedbacks.push(aval);
            }

        } else {
            $("#section-avaliacoes-title").html("Nenhuma avaliação").addClass("text-center");
        }

        $("#section-avaliacoes").html(Mustache.render(tpl.avaliacoes, feedbacks));
    } else {
        let feedbacks = [];
        let avaliacoes = await db.exeRead("avaliacao", {usuario: $("#idUsuario").val()});
        if (!isEmpty(avaliacoes)) {
            if (avaliacoes.length > 5)
                $("#section-avaliacoes-more").removeClass("hide");

            for (let aval of avaliacoes.slice(0, 5)) {
                let d = (aval.data.indexOf("T") > -1 ? aval.data.split("T")[0].split("-") : aval.data.split(" ")[0].split("-"));
                aval.imagem_do_cliente = (!isEmpty(aval.relationData.autorpub.imagem) ? aval.relationData.autorpub.imagem[0].urls.medium : HOME + "assetsPublic/img/favicon.png?v=" + VERSION);
                aval.data = d[2] + "/" + d[1] + "/" + d[0];
                aval.avaliacao_geral = (((!isEmpty(aval.atendimento) ? parseInt(aval.atendimento) : 10000000) + (!isEmpty(aval.qualidade) ? parseInt(aval.qualidade) : 10000000)) / 2);
                $("#avaliacaop").html(Mustache.render(tpl.profissionalStar, getProfissionalStar(aval.avaliacao_geral /10000000)));
                aval.star = getProfissionalStar(aval.avaliacao_geral /10000000);
                feedbacks.push(aval);
            }

        } else {
            $("#section-avaliacoes-title").html("Nenhuma avaliação").addClass("text-center");
        }

        $("#section-avaliacoes").html(Mustache.render(tpl.avaliacoes, feedbacks));
    }
});
