if (typeof filtrosProfissionais === "undefined") {
    var
        mapLoaded = typeof mapLoaded !== "undefined",
        filtrosProfissionais = {
            categoria: ""
        },
        servicesOnMapUpdate = null,
        services = [],
        servicesOnMap = [],
        openService = {};

    function changeSwipeToSearch() {
        openService = {};
        if (!$(".menu-swipe").hasClass("serviceFilterSearch")) {
            $(".menu-swipe").addClass("serviceFilterSearch").removeClass("servicePerfil buildPerfil");
            $(".swipe-zone-body").addClass("filter");
            closeMapPopup();
            dbLocal.exeRead("categorias").then(categorias => {

                for (let c in categorias) {
                    categorias[c].selected = (!isEmpty(filtrosProfissionais.categoria) && categorias[c].id === filtrosProfissionais.categoria);
                    categorias[c].opacity = (!isEmpty(filtrosProfissionais.categoria) ? .6 : 1);
                }

                $(".swipe-zone-body").htmlTemplate('serviceFilterSearch', {categorias: categorias}).then(() => {
                    updateListService(services);
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

    function changeSwipeToService(data) {
        openService = data;
        $(".menu-swipe").addClass("servicePerfil").removeClass("serviceFilterSearch buildPerfil");
        $(".swipe-zone-body").removeClass("filter");
        $(".swipe-zone-body").htmlTemplate('servicePerfil', data).then(() => {
            swipeContent($(".swipe-zone-body").find(".menu-swipe"));

            $(".menu-swipe-class").off("scroll").on("scroll", function (e) {
                let $this = $(this);
                if($this.scrollTop() === 0 || !$this.hasClass("openFull"))
                    $this.find(".menu-swipe").swipe("enable");
                else
                    $this.find(".menu-swipe").swipe("disable");

            });

            /**
             * Read avaliações
             */
            getJSON(HOME + "app/find/avaliacao/profissional/" + data.id).then(avaliacoes => {
                let feedbacks = [];
                if(!isEmpty(avaliacoes.avaliacao)) {
                    for (let i in avaliacoes.avaliacao) {
                        if(i > 4)
                            break;
                        avaliacoes.avaliacao[i].imagens = (!isEmpty(avaliacoes.avaliacao[i].imagens) ? JSON.parse(avaliacoes.avaliacao[i].imagens) : []);
                        avaliacoes.avaliacao[i].data = moment(avaliacoes.avaliacao[i].data).calendar();
                        avaliacoes.avaliacao[i].star = getProfissionalStar(parseInt(avaliacoes.avaliacao[i].qualidade) * 10);
                        feedbacks.push(avaliacoes.avaliacao[i]);
                    }
                    if(avaliacoes.avaliacao.length > 5)
                        $("#section-avaliacoes-more").removeClass("hide");

                    $("#section-avaliacoes-title").html("Avaliações");
                }

                $("#section-avaliacoes").htmlTemplate('avaliacoes', {avaliacoes: feedbacks});
            });

            $("#arrowback-perfil").off("click").on("click", function () {
                let pass = !1;
                for(let i in markers) {
                    if(markers[i].icon.url === HOME + VENDOR + "site-maocheia/public/assets/svg/map-marker-selected.svg") {
                        pass = !0;
                        break;
                    }
                }
                if (pass) {
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

    function getLogradouroFromEndereco(endereco) {
        return endereco.rua + " - " + endereco.bairro + ", " + endereco.cidade + " - " + endereco.estado + ", " + endereco.cep + ", " + endereco.pais;
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
            changeSwipeToSearch();
        } else {
            swipe.open();
            $("#procura").blur();
            let myService = services.filter(s => s.id === this.id);
            changeSwipeToService(myService[0]);
            openMapPopup(this);
        }
    }

    function profissionaisFiltrado(data) {
        let list = [];
        for (let i in data) {
            let pass = !0;
            for (let c in filtrosProfissionais) {
                if (c === "categoria" && !isEmpty(filtrosProfissionais[c]) && filtrosProfissionais[c] !== parseInt(data[i].perfil_profissional.categoria))
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
                            markerCluster.removeMarker(markers[e]);
                            markers[e].setMap(null);
                            delete (markers[e]);
                            break;
                        }
                    }
                }
            }
        }

        for (let i = 0; i < data.length; i++) {
            if (servicesOnMap.indexOf(data[i].id) === -1)
                addMarker(data[i], 2, parseFloat(data[i].latitude), parseFloat(data[i].longitude));
        }

        /**
         * Cria lista de servicesOnMap
         */
        servicesOnMap = [];
        for (let i = 0; i < data.length; i++)
            servicesOnMap.push(data[i].id);
    }

    function updateListService(data) {
        $("#services").htmlTemplate('serviceCards', {profissionais: data}, ["serviceCard"]);
    }

    /**
     * Lê todos os serviços em um raio de 200km
     */
    function readAllServices() {
        services = [];
        let latlng = map.getCenter();
        get("nearbyServices/" + latlng.lat() + "/" + latlng.lng() + "/200").then(result => {
            for(let i in result)
                services.push(getProfissionalMustache(result[i]));

            readServices();
            clearInterval(servicesOnMapUpdate);
            servicesOnMapUpdate = setInterval(function () {
                updateRealPosition();
            }, 4000);
        });
    }

    /**
     * Busca atualizações das posições dos profissionais
     */
    function updateRealPosition() {
        if (!navigator.onLine)
            clearInterval(servicesOnMapUpdate);

        let ids = [];
        for (let i in services)
            ids.push(services[i].id);

        post("site-maocheia", "updateRealTimeServices", {ids: ids}, function (results) {
            if (!isEmpty(results)) {
                let minhaLatlng = map.getCenter();

                for (let i in services) {
                    /**
                     * Atualiza lat, e lng
                     * Atualiza distancia também
                     */
                    services[i].latitude = results[services[i].id].latitude;
                    services[i].longitude = results[services[i].id].longitude;
                    services[i].distancia = getLatLngDistance(services[i].latitude, services[i].longitude, minhaLatlng.lat(), minhaLatlng.lng());

                    /**
                     * Atualiza posição dos markers no mapa
                     */
                    if (!isEmpty(markers)) {
                        for (let e in markers) {
                            if (markers[e].service.id == services[i].id) {
                                markers[e].setPosition(new google.maps.LatLng(parseFloat(services[i].latitude), parseFloat(services[i].longitude)));
                            }
                        }
                    }

                }
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
        return degrees * (Math.PI / 180);
    }

    /**
     * Atualiza lista e mapa com os serviços dentro da distância e dos filtros selecionados
     */
    function readServices() {
        let km = getZoomToKm(map.getZoom());
        let minhaLatlng = map.getCenter();

        /**
         * Verfica os resultados que devem ser mostrados no mapa a partir da distancia do meu ponto
         */
        let data = [];
        for (let i in services) {
            let distancia = getLatLngDistance(services[i].latitude, services[i].longitude, minhaLatlng.lat(), minhaLatlng.lng());
            if (distancia < km)
                data.push(services[i]);
        }

        /**
         * Aplica filtro aos resultados que serão mostrados no mapa
         */
        data = profissionaisFiltrado(data);

        updateListService(data);
        updateMapService(data);
    }

    function copyMapToBackground() {
        let $clone = $("#core-content").clone().attr("id", "core-map").removeClass("r-network r-403 mb-50").addClass("r-index");
        $("#core-content").html("");
        $("body").append($clone);
        $("a").one("click", function () {
            $("#core-map").css("display", "none");
        });
    }

    function backToMap() {
        $("#core-content").html("");
        $("#core-map").css("display", "block");
        $("a").one("click", function () {
            $("#core-map").css("display", "none");
        });
    }

    function initAutocomplete() {
        // copyMapToBackground();
        startMap();
    }
}

$(function () {
    if (!$("#core-map").length) {
        /**
         * Primeiro carregamento do mapa
         */
        if (navigator.onLine)
            $.cachedScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDOHzDqP5Obg3nqWwu-QwztEyhD8XENPGE&libraries=places,directions&callback=initAutocomplete&language=pt-br");
        else
            initAutocomplete();

        $("body").off("click", ".swipe-line").on("click", ".swipe-line", function () {
            if (!$(".menu-swipe").hasClass("openFull"))
                $(".menu-swipe").addClass("openFull");

        }).off("click", ".profissional").on("click", ".profissional", function () {
            for (let i in services) {
                if (services[i].id === $(this).attr("rel")) {
                    changeSwipeToService(services[i]);
                    openFullPerfil();
                    break;
                }
            }
        }).off("focus", "#procura").on("focus", "#procura", function () {
            changeSwipeToSearch();
            $(".menu-swipe").removeClass("openFull");
            $(".swipe-zone-body").addClass("translateY");
            if ($(".menu-swipe").hasClass("close"))
                swipe.open();

            $("#procura").one("blur", function () {
                let search = $(this).val();
                setTimeout(function () {
                    $(".swipe-zone-body").removeClass("translateY");
                    if (search.length) {
                        $(".menu-swipe").addClass("openFull");
                        $("#procura").val("");
                    }
                }, 100);

            }).off("keyup").on("keyup", function () {
                let search = $(this).val().toLowerCase();

                let results = [];
                for (let i in services) {
                    let service = services[i];
                    service.isService = !0;
                    results.push(service);
                }

                dbLocal.exeRead("categorias").then(cat => {
                    for (let c in cat) {
                        cat[c].isService = !1;
                        results.push(cat[c]);
                    }

                    $("#services").htmlTemplate("resultSearch", {results: results.filter(s => s.nome.toLowerCase().indexOf(search) > -1)}, ['serviceCard', 'serviceCategoryCard']).then(() => {
                        $(".serviceCategoryResult").one("click", function () {
                            $(".serviceCategory[rel='" + $(this).attr("rel") + "']").trigger("click");
                        });
                    })
                });

            })
        });
    } else {
        backToMap();
    }
});
