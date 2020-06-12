$(function() {
    db.exeRead("clientes", FRONT.VARIAVEIS[0]).then(cliente => {
        cliente.imagem_url = !isEmpty(cliente.imagem) ? cliente.imagem[0].urls.medium : "";
        cliente.avaliacao = getProfissionalStar(4.5);

        /**
         * Read avaliações
         */
        /*getJSON(HOME + "app/find/avaliacao/profissional/" + data.id).then(avaliacoes => {
            let feedbacks = [];
            if (!isEmpty(avaliacoes.avaliacao)) {
                for (let i in avaliacoes.avaliacao) {
                    if (i > 4)
                        break;
                    avaliacoes.avaliacao[i].imagens = (!isEmpty(avaliacoes.avaliacao[i].imagens) ? JSON.parse(avaliacoes.avaliacao[i].imagens) : []);
                    avaliacoes.avaliacao[i].data = moment(avaliacoes.avaliacao[i].data).format("DD/MM/YYYY");

                    avaliacoes.avaliacao[i].avaliacao_geral = (((!isEmpty(avaliacoes.avaliacao[i].atendimento) ? parseInt(avaliacoes.avaliacao[i].atendimento) : 10000000) + (!isEmpty(avaliacoes.avaliacao[i].qualidade) ? parseInt(avaliacoes.avaliacao[i].qualidade) : 10000000)) / 2);
                    avaliacoes.avaliacao[i].star = getProfissionalStar(avaliacoes.avaliacao[i].avaliacao_geral);
                    feedbacks.push(avaliacoes.avaliacao[i]);
                }
                if (avaliacoes.avaliacao.length > 5)
                    $("#section-avaliacoes-more").removeClass("hide");

                $("#section-avaliacoes-title").html("Avaliações");
            }

            $("#section-avaliacoes").htmlTemplate('avaliacoes', {avaliacoes: feedbacks});
        });*/

        $("#perfil-cliente").htmlTemplate("cliente", cliente);
    })
});