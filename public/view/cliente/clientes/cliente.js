$(function() {
    db.exeRead("clientes", FRONT.VARIAVEIS[0]).then(cliente => {
        cliente.imagem_url = (!isEmpty(cliente.perfil_profissional) && !isEmpty(cliente.perfil_profissional[0].imagem_de_perfil) ? cliente.perfil_profissional[0].imagem_de_perfil[0].urls.medium : (!isEmpty(cliente.imagem) ? cliente.imagem[0].urls.medium : ""));
        let avaliacao_geral =  parseFloat( parseFloat((!isEmpty(cliente.perfil_profissional) ? ((cliente.perfil_profissional[0].atendimento + cliente.perfil_profissional[0].qualidade) / 2) : cliente.avaliacao) /10000000).toFixed(1));
        cliente.avaliacao = getProfissionalStar(avaliacao_geral);
        cliente.avaliacao.avaliacao = parseFloat(cliente.avaliacao.avaliacao).toFixed(1).replace(".", ",");

        $("#perfil-cliente").htmlTemplate("cliente", cliente);
    })
});