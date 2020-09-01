async function avaliacoesFuncao(data) {

    let dataFormated = [];
    if(!isEmpty(data)) {
        let total = 0;
        let nota = 0;
        for (let aval of data.slice(0, 5)) {
            if (typeof aval.relationData.autorpub.relationData !== "undefined") {
                let cliente = aval.relationData.autorpub.relationData.clientes;

                /**
                 * Data
                 */
                let d = (aval.data.indexOf("T") > -1 ? aval.data.split("T")[0].split("-") : aval.data.split(" ")[0].split("-"));
                aval.data = d[2] + "/" + d[1] + "/" + d[0];

                /**
                 * Image
                 */
                aval.imagem_do_cliente = (!isEmpty(cliente.perfil_profissional) ? cliente.perfil_profissional[0].imagem_de_perfil[0].urls.thumb : (!isEmpty(cliente.imagem) ? cliente.imagem[0].urls.thumb : (!isEmpty(cliente.imagem_url) ? cliente.imagem_url : HOME + "assetsPublic/img/favicon.png?v=" + VERSION)));

                aval.avaliacao_geral = (((!isEmpty(aval.atendimento) ? parseInt(aval.atendimento) : 10000000) + (!isEmpty(aval.qualidade) ? parseInt(aval.qualidade) : 10000000)) / 2);
                aval.star = getProfissionalStar(aval.avaliacao_geral / 10000000);
                nota += aval.avaliacao_geral;
                total++;
                dataFormated.push(aval);
            }
        }

        dataFormated.notaFinal = ((nota / total) / 10000000);
    }

    return dataFormated;
}

async function usuarioFuncao(data) {
    data[0].relationData.clientes.perfil_profissional[0].qualidade = parseFloat(data[0].relationData.clientes.perfil_profissional[0].qualidade / 10000000).toFixed(1).replace(".", ",");
    data[0].relationData.clientes.perfil_profissional[0].atendimento = parseFloat(data[0].relationData.clientes.perfil_profissional[0].atendimento / 10000000).toFixed(1).replace(".", ",");
    data[0].relationData.clientes.perfil_profissional[0].preco_justo = parseFloat(data[0].relationData.clientes.perfil_profissional[0].preco_justo / 10000000).toFixed(1).replace(".", ",");

    return data;
}