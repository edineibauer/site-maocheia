// var intervalPosition;
if(window.screen.lockOrientation)
    window.screen.orientation.lock("portrait");

if(typeof ScreenOrientation.lock === "function")
    ScreenOrientation.lock("portrait");

function getProfissionalMustache(profissional, cat, subcategorias) {
    profissional = Object.assign({}, profissional);
    profissional.perfil_profissional.imagem_de_perfil = !isEmpty(profissional.perfil_profissional.imagem_de_perfil) ? profissional.perfil_profissional.imagem_de_perfil[0].urls.thumb : HOME + VENDOR + "site-maocheia/public/assets/svg/account.svg";
    profissional.perfil_profissional.imagem_de_fundo = !isEmpty(profissional.perfil_profissional.imagem_de_fundo) ? profissional.perfil_profissional.imagem_de_fundo[0].urls.medium : "";

    // profissional.endereco = (!isEmpty(profissional.endereco) ? getLogradouroFromEndereco(profissional.endereco[0]) : "");

    let avaliacao = parseFloat(parseFloat((((!isEmpty(profissional.perfil_profissional.atendimento) ? parseInt(profissional.perfil_profissional.atendimento) : 10000000) + (!isEmpty(profissional.perfil_profissional.qualidade) ? parseInt(profissional.perfil_profissional.qualidade) : 10000000)) / 2) / 10000000).toFixed(1));
    let preco = parseFloat(parseFloat((!isEmpty(profissional.perfil_profissional.preco_justo) ? parseInt(profissional.perfil_profissional.preco_justo) : 10000000) / 10000000).toFixed(1));

    profissional.perfil_profissional = Object.assign(profissional.perfil_profissional, getProfissionalStar(avaliacao));
    profissional.perfil_profissional = Object.assign(profissional.perfil_profissional, getProfissionalPreco(preco));
    profissional.perfil_profissional.avaliacao = profissional.perfil_profissional.avaliacao.toString().replace(".", ',');

    profissional.perfil_profissional.sitePretty = !isEmpty(profissional.perfil_profissional.site) ? profissional.perfil_profissional.site.replace("https://", "").replace("http://", "").replace("/", "") : "";
    profissional.perfil_profissional.haveAvaliacoes = !1;
    profissional.perfil_profissional.avaliacoes = [];
    if(!isEmpty(profissional.perfil_profissional.inicio)) {
        let t = profissional.perfil_profissional.inicio.split(":");
        profissional.perfil_profissional.inicio = t[0] + ":" + t[1];
    } else {
        profissional.perfil_profissional.inicio = "08:00";
    }
    if(!isEmpty(profissional.perfil_profissional.termino)) {
        t = profissional.perfil_profissional.termino.split(":");
        profissional.perfil_profissional.termino = t[0] + ":" + t[1];
    } else {
        profissional.perfil_profissional.termino = "18:00";
    }

    let hora = moment().format("HH:m");
    let week = moment().weekday();
    week = (week === 0 ? "domingo" : (week === 1 ? "segunda" : (week === 2 ? "terca" : (week === 3 ? "quarta" : (week === 4 ? "quinta" : (week === 5 ? "sexta" : "sabado"))))));

    profissional.perfil_profissional.dias = (!isEmpty(profissional.perfil_profissional.dias) ? (isJson(profissional.perfil_profissional.dias) ? JSON.parse(profissional.perfil_profissional.dias) : profissional.perfil_profissional.dias) : "");
    profissional.perfil_profissional.online = profissional.perfil_profissional.inicio < hora && profissional.perfil_profissional.termino > hora && !isEmpty(profissional.perfil_profissional.dias) && profissional.perfil_profissional.dias.indexOf(week) > -1;
    profissional.perfil_profissional.categoriaNome = cat.nome;
    profissional.perfil_profissional.categoriaImage = (!isEmpty(cat.imagem) ? cat.imagem[0].urls.thumb : HOME + VENDOR + "site-maocheia/public/assets/svg/account.svg");

    profissional.perfil_profissional.subcategoriasData = [];
    if(!isEmpty(profissional.perfil_profissional.subcategorias)) {
        profissional.perfil_profissional.haveSubcategorias = !0;
        for (let i in profissional.perfil_profissional.subcategorias)
            profissional.perfil_profissional.subcategoriasData.push(subcategorias.filter(sb => sb.id === parseInt(profissional.perfil_profissional.subcategorias[i]))[0]);

    } else {
        profissional.perfil_profissional.haveSubcategorias = !1;
    }

    if(typeof map !== "undefined") {
        let minhaLatlng = map.getCenter();
        profissional.distancia = getLatLngDistance(profissional.latitude, profissional.longitude, minhaLatlng.lat(), minhaLatlng.lng());
        profissional.distanciaKm = (profissional.distancia < 1 ? parseInt(profissional.distancia * 1000) + "m" : (profissional.distancia > 20 ? parseInt(profissional.distancia) : parseFloat(profissional.distancia).toFixed(1)) + " km").replace(".", ',');
        profissional.perfil_profissional.ativo = !(isNumberPositive(profissional.perfil_profissional.distancia_de_atendimento_km) && parseInt(profissional.perfil_profissional.distancia_de_atendimento_km) < profissional.distancia);

    } else {
        profissional.distancia = "~";
        profissional.distanciaKm = "~"
    }

    return profissional;
}

/**
 * Obtém os dados de preço
 * @param preco
 * @returns {{}}
 */
function getProfissionalPreco(preco) {
    let aval = {};
    aval.preco_justo = isNumberPositive(preco) && preco < 5.001 ? preco : 1;
    aval.preco_justo = (aval.preco_justo * 3) / 5;
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
    let aval = {};
    aval.avaliacao = isNumberPositive(avaliacao) && avaliacao < 5.001 ? avaliacao : 1;
    aval.avaliacao_star1 = aval.avaliacao > .2;
    aval.avaliacao_star2 = aval.avaliacao > 1.2;
    aval.avaliacao_star3 = aval.avaliacao > 2.2;
    aval.avaliacao_star4 = aval.avaliacao > 3.2;
    aval.avaliacao_star5 = aval.avaliacao > 4.2;
    aval.avaliacao_star1_half = aval.avaliacao > .2 && aval.avaliacao < .8;
    aval.avaliacao_star2_half = aval.avaliacao > 1.2 && aval.avaliacao < 1.8;
    aval.avaliacao_star3_half = aval.avaliacao > 2.2 && aval.avaliacao < 2.8;
    aval.avaliacao_star4_half = aval.avaliacao > 3.2 && aval.avaliacao < 3.8;
    aval.avaliacao_star5_half = aval.avaliacao > 4.2 && aval.avaliacao < 4.8;

    return aval;
}

/**
 * Busca a distância entre duas coordenadas
 */
function getLatLngDistance(lat, lng, lat2, lng2) {
    return (6371 * Math.acos(Math.cos(degrees_to_radians(lat)) * Math.cos(degrees_to_radians(lat2)) * Math.cos(degrees_to_radians(lng) - degrees_to_radians(lng2)) + Math.sin(degrees_to_radians(lat)) * Math.sin(degrees_to_radians(lat2))));
}

function degrees_to_radians(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Verifica se tem mensagens pendentes
 * @returns {Promise<void>}
 */
/*async function checkMensagens() {
    let pendentes = 0;
    let mensagens = await db.exeRead("mensagens");
    if(!isEmpty(mensagens)) {
        for(let i in mensagens) {
            if(mensagens[i].pendente === 1)
                pendentes++
        }
    }
    if(pendentes !== 0)
        $("#core-header-nav-bottom").find("a[href='mensagem']").append("<div class='badge-notification'>" + pendentes + "</div>");
}*/

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

    // clearInterval(intervalPosition);
    // intervalPosition = setInterval(function () {
    //     checkMensagens();
    // }, 4000);
});