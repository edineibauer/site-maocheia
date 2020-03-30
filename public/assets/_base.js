function getProfissionalMustache(profissional) {
    profissional = Object.assign({}, profissional);
    profissional.perfil_profissional.imagem_de_perfil = !isEmpty(profissional.perfil_profissional.imagem_de_perfil) ? profissional.perfil_profissional.imagem_de_perfil[0].url : HOME + VENDOR + "site-maocheia/public/assets/svg/account.svg";
    profissional.perfil_profissional.imagem_de_fundo = !isEmpty(profissional.perfil_profissional.imagem_de_fundo) ? profissional.perfil_profissional.imagem_de_fundo[0].url : "";

    // profissional.endereco = (!isEmpty(profissional.endereco) ? getLogradouroFromEndereco(profissional.endereco[0]) : "");

    profissional.perfil_profissional = Object.assign(profissional.perfil_profissional, getProfissionalStar(profissional.avaliacao_profissional || 0));
    profissional.perfil_profissional = Object.assign(profissional.perfil_profissional,  getProfissionalPreco(profissional.preco_justo || 0));

    profissional.perfil_profissional.haveAvaliacoes = !1;
    profissional.perfil_profissional.avaliacoes = [];

    dbLocal.exeRead("categorias", parseInt(profissional.perfil_profissional.categoria)).then(cat => {
        profissional.perfil_profissional.categoriaNome = cat.nome;
    });

    profissional.distanciaKm = (profissional.distancia < 1 ? parseInt(profissional.distancia * 1000) + "m" : parseFloat(profissional.distancia).toFixed(1) + "KM");

    return profissional;
}

/**
 * Obtém os dados de preço
 * @param preco
 * @returns {{}}
 */
function getProfissionalPreco(preco) {
    preco = parseInt(typeof preco === "undefined" || isNaN(preco) ? 0 : (preco < 31 ? (preco > 0 ? preco : 0) : 30));
    let aval = {};
    aval.preco_justo = Math.round(preco * .1);
    aval.preco_star1 = aval.preco_justo >= 1;
    aval.preco_star2 = aval.preco_justo >= 2;
    aval.preco_star3 = aval.preco_justo >= 3;

    return aval;
}

/**
 * Obtém os dados de avaliação
 * @param avaliacao
 * @returns {{}}
 */
function getProfissionalStar(avaliacao) {
    avaliacao = parseInt(typeof avaliacao === "undefined" || isNaN(avaliacao) ? 0 : (avaliacao < 51 ? (avaliacao > 0 ? avaliacao : 0) : 50));
    let aval = {};
    aval.avaliacao = parseFloat(avaliacao * .1).toFixed(1);
    aval.avaliacao_star1 = aval.avaliacao >= .2;
    aval.avaliacao_star2 = aval.avaliacao >= 1.2;
    aval.avaliacao_star3 = aval.avaliacao >= 2.2;
    aval.avaliacao_star4 = aval.avaliacao >= 3.2;
    aval.avaliacao_star5 = aval.avaliacao >= 4.2;
    aval.avaliacao_star1_half = aval.avaliacao > .2 && aval.avaliacao < .8;
    aval.avaliacao_star2_half = aval.avaliacao > 1.2 && aval.avaliacao < 1.8;
    aval.avaliacao_star3_half = aval.avaliacao > 2.2 && aval.avaliacao < 2.8;
    aval.avaliacao_star4_half = aval.avaliacao > 3.2 && aval.avaliacao < 3.8;
    aval.avaliacao_star5_half = aval.avaliacao > 4.2 && aval.avaliacao < 4.8;

    return aval;
}

$(function ($) {
    $.fn.profissionalStar = function (avaliacao) {
        getTemplates().then(tpl => {
            this.html(Mustache.render(tpl.profissionalStar, getProfissionalStar(avaliacao)));
        });
        return this
    };

    $.fn.profissionalPreco = function (preco) {
        getTemplates().then(tpl => {
            this.html(Mustache.render(tpl.profissionalPreco, getProfissionalPreco(preco)));
        });
        return this
    };
});