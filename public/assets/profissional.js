function getProfissionalMustache(profissional) {
    profissional = Object.assign({}, profissional);
    profissional.imagem_de_perfil = !isEmpty(profissional.imagem_de_perfil) ? profissional.imagem_de_perfil[0].url : HOME + VENDOR + "site-maocheia/public/assets/svg/account.svg";
    profissional.imagem_de_fundo = !isEmpty(profissional.imagem_de_fundo) ? profissional.imagem_de_fundo[0].url : "";
    profissional.endereco = (!isEmpty(profissional.endereco) ? getLogradouroFromEndereco(profissional.endereco[0]) : "");
    profissional.avaliacao = !isEmpty(profissional.avaliacao) ? (profissional.avaliacao * .1) : 0;
    profissional.preco_justo = !isEmpty(profissional.preco_justo) ? profissional.preco_justo : 0;
    profissional.avaliacao_star1 = profissional.avaliacao >= .2;
    profissional.avaliacao_star2 = profissional.avaliacao >= 1.2;
    profissional.avaliacao_star3 = profissional.avaliacao >= 2.2;
    profissional.avaliacao_star4 = profissional.avaliacao >= 3.2;
    profissional.avaliacao_star5 = profissional.avaliacao >= 4.2;
    profissional.avaliacao_star1_half = profissional.avaliacao > .2 && profissional.avaliacao < .8;
    profissional.avaliacao_star2_half = profissional.avaliacao > 1.2 && profissional.avaliacao < 1.8;
    profissional.avaliacao_star3_half = profissional.avaliacao > 2.2 && profissional.avaliacao < 2.8;
    profissional.avaliacao_star4_half = profissional.avaliacao > 3.2 && profissional.avaliacao < 3.8;
    profissional.avaliacao_star5_half = profissional.avaliacao > 4.2 && profissional.avaliacao < 4.8;
    profissional.preco_star1 = profissional.preco_justo >= 1;
    profissional.preco_star2 = profissional.preco_justo >= 2;
    profissional.preco_star3 = profissional.preco_justo >= 3;

    dbLocal.exeRead("categorias", parseInt(profissional.categoria)).then(cat => {
        profissional.categoriaNome = cat.nome;
    });

    return profissional;
}

$(function() {
    let p = Object.assign({}, JSON.parse(USER.setorData.perfil_profissional)[0]);
    p.haveAvaliacoes = !1;
    p.avaliacoes = [];
    let data = getProfissionalMustache(p);
    console.log(p);
    $("#profissional-perfil").htmlTemplate('servicePerfil', data);
});