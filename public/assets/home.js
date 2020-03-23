var
    mapLoaded = typeof mapLoaded !== "undefined",
    filtrosProfissionais = {
        categoria: ""
    },
    servicesOnMapUpdate = null,
    services = [],
    servicesOnMap = [],
    openService = {};

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

function changeSwipeToSearch() {
    openService = {};
    if (!$(".menu-swipe").hasClass("serviceFilterSearch")) {
        $(".menu-swipe").addClass("serviceFilterSearch").removeClass("servicePerfil buildPerfil");
        closeMapPopup();
        dbLocal.exeRead("categorias").then(categorias => {

            for (let c in categorias) {
                categorias[c].selected = (!isEmpty(filtrosProfissionais.categoria) && categorias[c].id === filtrosProfissionais.categoria);
                categorias[c].opacity = (!isEmpty(filtrosProfissionais.categoria) ? .6 : 1);
            }

            $(".swipe-zone-body").htmlTemplate('serviceFilterSearch', {categorias: categorias}).then(() => {
                readAllServices();
                $(".serviceCategory").off("click").on("click", function () {
                    if ($(this).hasClass("selecionado")) {
                        filtrosProfissionais.categoria = "";
                        $(".serviceCategory").removeClass("selecionado").css("opacity", 1);
                    } else {
                        filtrosProfissionais.categoria = parseInt($(this).attr('rel'));
                        $(".serviceCategory").removeClass("selecionado").css("opacity", .6);
                        $(this).addClass("selecionado");
                    }
                    readServices();
                });

                // init Isotope
                var $grid = $('.row .grid').isotope({
                    itemSelector: '.profissional',
                    layoutMode: 'fitRows'
                });

                // filter functions
                $('.filters-button-group').on('click', 'button', function () {
                    var filterValue = $(this).attr('data-filter');
                    $grid.isotope({filter: filterValue});
                });

                // change is-checked class on buttons
                $('.button-group').each(function (i, buttonGroup) {
                    var $buttonGroup = $(buttonGroup);
                    $buttonGroup.on('click', 'button', function () {
                        $buttonGroup.find('.is-checked').removeClass('is-checked');
                        $(this).addClass('is-checked');
                    });
                });

                $('#pesquisa .owl-carousel').owlCarousel({
                    loop: false,
                    margin: 10,
                    dots: false,
                    nav: false,
                    responsive: {
                        0: {
                            items: 4,
                            startPosition: 0
                        },
                        600: {
                            items: 6
                        },
                        1000: {
                            items: 10
                        }
                    }
                });

                $('.owl-carousel.carousel-filters').owlCarousel({
                    loop: false,
                    margin: 4,
                    dots: false,
                    nav: false,
                    autoWidth: true,
                    responsive: {
                        0: {
                            items: 4,
                            startPosition: 0
                        },
                        600: {
                            items: 6
                        },
                        1000: {
                            items: 10
                        }
                    }
                });
            });
        });
    }
}

function getLogradouroFromEndereco(endereco) {
    return endereco.rua + " - " + endereco.bairro + ", " + endereco.cidade + " - " + endereco.estado + ", " + endereco.cep + ", " + endereco.pais;
}

function changeSwipeToService(data) {
    openService = data;
    data.haveAvaliacoes = !1;
    data.avaliacoes = [];
    $(".menu-swipe").addClass("servicePerfil").removeClass("serviceFilterSearch buildPerfil");
    $(".swipe-zone-body").htmlTemplate('servicePerfil', data).then(() => {
        $("#arrowback-perfil").off("click").on("click", function () {
            if ($(".popup-container").length) {
                closeFullPerfil();
            } else {
                closeFullPerfilHistory();
                changeSwipeToSearch();
            }
        });

        $("#imagem-perfil, h2.nome").off("click").on("click", function () {
            openFullPerfil();
        });
    });
}

function openFullPerfil() {
    let state = history.state;
    state.param = Object.assign(state.param || {}, {service: openService});
    history.replaceState(state, null, HOME + state.route);
    $(".menu-swipe").addClass("openFull");
}

function closeFullPerfil() {
    closeFullPerfilHistory();
    $(".menu-swipe").removeClass("openFull");
}

function closeFullPerfilHistory() {
    history.state.param = {};
    let state = history.state;
    state.param = {};
    history.replaceState(state, null, HOME + state.route);
}

function changeSwipeToBuild() {
    openService = {};
    $(".menu-swipe").addClass("buildPerfil").removeClass("servicePerfil serviceFilterSearch");

}

/**
 * Mostra o card do prestador de serviço ao clicar no marker
 */
function toogleServicePerfil() {
    closeAllMapPopupExceptThis(this);

    if ($("#" + this.id).length) {
        openFullPerfil();
    } else {
        swipe.open();
        $("#procura").blur();
        changeSwipeToService(this.service);
        openMapPopup(this);
    }
}

function profissionaisFiltrado(data) {
    let list = [];
    for (let i in data) {
        let pass = !0;
        for (let c in filtrosProfissionais) {
            if (c === "categoria" && !isEmpty(filtrosProfissionais[c]) && filtrosProfissionais[c] !== parseInt(data[i].categoria))
                pass = !1;
        }

        if (pass)
            list.push(data[i]);
    }

    return list;
}

function updateMapService(data) {

    /**
     * Remove services from map
     */
    if (!isEmpty(servicesOnMap)) {
        for (let m in servicesOnMap) {
            if (!data.some(el => el.id === servicesOnMap[m])) {
                for (let e in markers) {
                    if (markers[e].id === servicesOnMap[m]) {
                        markers[e].setMap(null);
                        delete (markers[e]);
                        break;
                    }
                }
            }
        }
    }

    for (let i = 0; i < data.length; i++) {
        if (servicesOnMap.indexOf(data[i].id) === -1) {
            setTimeout(function () {
                addMarker(data[i], 2, parseFloat(data[i].latitude), parseFloat(data[i].longitude));
            }, i * Math.floor((Math.random() * 130) + 70));
        }
    }

    /**
     * Cria lista de servicesOnMap
     */
    servicesOnMap = [];
    for (let i = 0; i < data.length; i++)
        servicesOnMap.push(data[i].id);
}

function updateListService(data) {
    $("#services").htmlTemplate('serviceCards', {profissionais: data}).then(() => {
        /**
         * Funções na lista de cards de serviço
         */
        $(".profissional").off("click").on("click", function () {
            db.exeRead("profissional", parseInt($(this).attr("rel"))).then(service => {
                changeSwipeToService(getProfissionalMustache(service));
                openFullPerfil();
            })
        });
    });
}

/**
 * Lê todos os serviços em um raio de 200km
 */
function readAllServices() {
    let latlng = map.getCenter();
    get("nearbyServices/" + latlng.lat() + "/" + latlng.lng() + "/200").then(result => {
        services = result;

        servicesOnMapUpdate = setInterval(function () {
            updateRealPosition();
        }, 3000);
    });
}

/**
 * Busca atualizações das posições dos profissionais
 */
function updateRealPosition() {
    let ids = [];
    for(let i in services)
        ids.push(services[i].id);

    post("site-maocheia", "updateRealTimeServices", {ids: ids}, function (results) {
        if(!isEmpty(results)) {
            for (let i in services) {
                services[i].latitude = results[services[i].id].latitude;
                services[i].longitude = results[services[i].id].longitude;
            }

            readServices();
        }
    });
}

/**
 * Busca a distância entre duas coordenadas
 */
function getLatLngDistance(lat, lng, lat2, lng2) {
    return (6371 * Math.acos(Math.cos(degrees_to_radians(lat)) * Math.cos(degrees_to_radians(lat2)) * Math.cos(degrees_to_radians(lng) - degrees_to_radians(lng2)) + Math.sin(degrees_to_radians(lat)) * Math.sin(degrees_to_radians(lat2))));
}

function degrees_to_radians(degrees) {
    return degrees * (Math.PI/180);
}

/**
 * Atualiza lista e mapa com os serviços dentro da distância e dos filtros selecionados
 */
function readServices(repeat) {
    let km = getZoomToKm(map.getZoom());
    let minhaLatlng = map.getCenter();

    /**
     * Verfica os resultados que devem ser mostrados no mapa a partir da distancia do meu ponto
     */
    let data = [];
    for(let i in services) {
        let distancia = getLatLngDistance(services[i].latitude, services[i].longitude, minhaLatlng.lat(), minhaLatlng.lng());
        if(distancia < km)
            data.push(getProfissionalMustache(services[i]));
    }

    /**
     * Aplica filtro aos resultados que serão mostrados no mapa
     */
    data = profissionaisFiltrado(data);

    updateListService(data);
    updateMapService(data);

    /**
     * Repete a requisição, pois pode ter o efeito de arraste na tela
     * ao fim do efeito, 400 milesegundos em média, a posição central
     * pode ser diferente da posição no disparo dessa função
     */
    if(typeof repeat === "undefined") {
        setTimeout(function() {
            readServices(1);
        },400);
    }
}

function initAutocomplete() {
    setTimeout(function () {
        startMap();
    },100);
}



$(function () {
    $("#core-content").addClass("hide");

    /*if(!$("#core-content-map").length) {
        getTemplates().then(tpl => {
            $("#core-content").after(Mustache.render(tpl.homeMap));

            if(!mapLoaded) {
                mapLoaded = !0;
                $.cachedScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDOHzDqP5Obg3nqWwu-QwztEyhD8XENPGE&libraries=places,directions&callback=initAutocomplete&language=pt-br");
            } else {
                initAutocomplete();
            }
        });
    } else {
        $("#core-content-map").removeClass("hide");
    }*/

    $("#procura").off("focus").on("focus", function () {
        changeSwipeToSearch();
        swipe.open();
        $(".menu-swipe").addClass("openFull");
    });

    if(!mapLoaded) {
        mapLoaded = !0;
        $.cachedScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDOHzDqP5Obg3nqWwu-QwztEyhD8XENPGE&libraries=places,directions&callback=initAutocomplete&language=pt-br");
    } else {
        initAutocomplete();
    }
});
