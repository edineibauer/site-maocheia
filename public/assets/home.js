var
    filtrosProfissionais = {
        categoria: ""
    },
    servicesOnMap = [];

function getProfissionalMustache(profissional) {
    profissional.imagem_de_perfil = !isEmpty(profissional.imagem_de_perfil) ? profissional.imagem_de_perfil[0].url : HOME + VENDOR + "site-maocheia/public/assets/img/perfil.jpg";
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
    if (!$(".menu-swipe").hasClass("serviceFilterSearch")) {
        $(".menu-swipe").addClass("serviceFilterSearch").removeClass("servicePerfil buildPerfil");
        closeMapPopup();
        dbLocal.exeRead("categorias").then(categorias => {

            for(let c in categorias) {
                categorias[c].selected = (!isEmpty(filtrosProfissionais.categoria) && categorias[c].id === filtrosProfissionais.categoria);
                categorias[c].opacity = (!isEmpty(filtrosProfissionais.categoria) ? .6 : 1);
            }

            $(".swipe-zone-body").htmlTemplate('serviceFilterSearch', {categorias: categorias}).then(() => {
                readServices();
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
    $(".menu-swipe").addClass("servicePerfil").removeClass("serviceFilterSearch buildPerfil");
    $(".swipe-zone-body").htmlTemplate('servicePerfil', data).then(() => {
        $("#arrowback-perfil").off("click").on("click", function () {
            if($(".popup-container").length) {
                $(".menu-swipe").removeClass("openFull");
            } else {
                changeSwipeToSearch();
            }
        });

        $("#imagem-perfil, h2.nome").off("click").on("click", function () {
            $(".menu-swipe").addClass("openFull");
        });
    });
}

function changeSwipeToBuild() {
    $(".menu-swipe").addClass("buildPerfil").removeClass("servicePerfil serviceFilterSearch");

}

/**
 * Mostra o card do prestador de serviço ao clicar no marker
 */
function toogleServicePerfil() {
    closeAllMapPopupExceptThis(this);

    if ($("#" + this.id).length) {
        $(".menu-swipe").addClass("openFull");
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
    if(!isEmpty(servicesOnMap)) {
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
            })
        });
    });
}

function readServices() {
    let km = getZoomToKm(map.getZoom());
    let latlng = map.getCenter();
    get("nearbyServices/" + latlng.lat() + "/" + latlng.lng() + "/" + km).then(result => {
        let data = [];
        for (let i in result)
            data.push(getProfissionalMustache(result[i]));

        data = profissionaisFiltrado(data);

        updateListService(data);
        updateMapService(data);
    });
}

$(function () {
    $("#procura").off("focus").on("focus", function () {
        changeSwipeToSearch();
        swipe.open();
        $(".menu-swipe").addClass("openFull");
    });
});
