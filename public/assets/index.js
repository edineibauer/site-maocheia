var
    mapLoaded = typeof mapLoaded !== "undefined",
    filtrosProfissionais = {
        categoria: ""
    },
    servicesOnMapUpdate = null,
    services = [],
    servicesFiltered = [],
    openService = {};

function changeSwipeToSearch() {
    openService = {};
    if (!$(".menu-swipe").hasClass("serviceFilterSearch")) {
        $(".menu-swipe").addClass("serviceFilterSearch").removeClass("servicePerfil buildPerfil");
        $(".swipe-zone-body").addClass("filter");
        closeMapPopup();
        db.exeRead("categorias").then(categorias => {

            for (let c in categorias)
                categorias[c].selected = (!isEmpty(filtrosProfissionais.categoria) && categorias[c].id === filtrosProfissionais.categoria);

            if (USER.setor === 0)
                $(".menu-swipe-class").addClass("anonimo");

            $(".swipe-zone-body").htmlTemplate('serviceFilterSearch', {categorias: categorias}).then(() => {
                updateListService(services);
                $(".serviceCategory").off("click").on("click", function () {
                    if ($(this).hasClass("selecionado")) {
                        filtrosProfissionais.categoria = "";
                        $(".serviceCategory").removeClass("selecionado");
                    } else {
                        filtrosProfissionais.categoria = parseInt($(this).attr('rel'));
                        $(".serviceCategory").removeClass("selecionado");
                        $(this).addClass("selecionado");
                    }
                    readServices();
                    setAllServicesOnMap(servicesFiltered);
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
                            items: 5,
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
        $(".menu-swipe-class").off("scroll").on("scroll", function (e) {
            let $this = $(this);
            if ($this.scrollTop() === 0 || !$this.hasClass("openFull"))
                $this.find(".menu-swipe").swipe("enable");
            else
                $this.find(".menu-swipe").swipe("disable");

        });

        /**
         * Read avaliações
         */
        getJSON(HOME + "app/find/avaliacao/profissional/" + data.id).then(avaliacoes => {
            let feedbacks = [];
            if (!isEmpty(avaliacoes.avaliacao)) {
                for (let i in avaliacoes.avaliacao) {
                    if (i > 4)
                        break;
                    avaliacoes.avaliacao[i].imagens = (!isEmpty(avaliacoes.avaliacao[i].imagens) ? JSON.parse(avaliacoes.avaliacao[i].imagens) : []);
                    avaliacoes.avaliacao[i].data = moment(avaliacoes.avaliacao[i].data).calendar();
                    avaliacoes.avaliacao[i].star = getProfissionalStar(parseInt(avaliacoes.avaliacao[i].qualidade) * 10);
                    feedbacks.push(avaliacoes.avaliacao[i]);
                }
                if (avaliacoes.avaliacao.length > 5)
                    $("#section-avaliacoes-more").removeClass("hide");

                $("#section-avaliacoes-title").html("Avaliações");
            }

            $("#section-avaliacoes").htmlTemplate('avaliacoes', {avaliacoes: feedbacks});
        });

        $("#arrowback-perfil").off("click").on("click", function () {
            let pass = !1;
            for (let i in markers) {
                if (/serviceSelected$/.test(markers[i].icon.url)) {
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

/*function getLogradouroFromEndereco(endereco) {
    return endereco.rua + " - " + endereco.bairro + ", " + endereco.cidade + " - " + endereco.estado + ", " + endereco.cep + ", " + endereco.pais;
}*/

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

/*function changeSwipeToBuild() {
    openService = {};
    $(".menu-swipe").addClass("buildPerfil").removeClass("servicePerfil serviceFilterSearch");
}*/

/**
 * Mostra o card do prestador de serviço ao clicar no marker
 */
function toogleServicePerfil() {
    closeAllMapPopupExceptThis(this);

    let pass = !1;
    for (let i in markers) {
        if (/serviceSelected$/.test(markers[i].icon.url)) {
            pass = !0;
            break;
        }
    }

    if (pass) {
        changeSwipeToSearch();
    } else {
        $(".menu-swipe-class").addClass("open").removeClass("openFull close");
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

function setAllServicesOnMap(data) {
    /**
     * Remove all markers and clusters
     */
    for (let e in markers) {
        markerCluster.removeMarker(markers[e]);
        markers[e].setMap(null);
        delete (markers[e]);
    }

    data = data || services;

    /**
     * Add all data to map as markers
     */
    for (let i = 0; i < data.length; i++)
        addMarker(data[i], 2, parseFloat(data[i].latitude), parseFloat(data[i].longitude));
}

function updateListService(data) {
    $("#services").htmlTemplate('serviceCards', {profissionais: data}, ["serviceCard"]);
}

/**
 * Lê todos os serviços em um raio de 200km
 */
function readAllServices(localizationAnonimo) {
    let latlng = map.getCenter();
    get("nearbyServices/" + latlng.lat() + "/" + latlng.lng() + "/" + (typeof localizationAnonimo !== "undefined" ? 2000 : 200)).then(result => {

        db.exeRead("categorias").then(categories => {
            services = [];
            for (let i in result) {
                services.push(getProfissionalMustache(result[i], categories.find(s => s.id == result[i].perfil_profissional.categoria)));
            }
            readServices();
            setAllServicesOnMap();

            if (navigator.onLine && USER.setor !== 0) {
                clearInterval(servicesOnMapUpdate);
                servicesOnMapUpdate = setInterval(function () {
                    updateRealPosition();
                }, 4000);
            }
        });
    });
}

/**
 * Busca atualizações das posições dos profissionais
 */
function updateRealPosition() {
    if (!navigator.onLine || USER.setor === 0) {
        clearInterval(servicesOnMapUpdate);

    } else {
        get("realtimePositionServices").then(results => {
            if (!isEmpty(results)) {
                let minhaLatlng = map.getCenter();

                /**
                 * Para cada resultado retornado
                 * atualiza posição no mapa e distância da minha posição
                 */
                for (let i in results) {
                    for (let s in services) {
                        if (services[s].id === results[i].cliente) {
                            /**
                             * Atualiza lat, e lng
                             * Atualiza distancia também
                             */
                            services[s].latitude = results[i].latitude;
                            services[s].longitude = results[i].longitude;
                            services[s].data_de_atualizacao = results[i].data_de_atualizacao;
                            services[s].distancia = getLatLngDistance(services[s].latitude, services[s].longitude, minhaLatlng.lat(), minhaLatlng.lng());

                            /**
                             * Atualiza posição dos markers no mapa
                             */
                            if (!isEmpty(markers)) {
                                for (let m in markers) {
                                    if (markers[m].id === services[s].id) {
                                        markers[m].setPosition(new google.maps.LatLng(parseFloat(services[s].latitude), parseFloat(services[s].longitude)));
                                        break;
                                    }
                                }
                            }

                            break;
                        }
                    }
                }
            }
        });
    }
}

/**
 * Atualiza lista e mapa com os serviços dentro da distância e dos filtros selecionados
 */
function readServices() {
    // let km = getZoomToKm(map.getZoom());
    // let minhaLatlng = map.getCenter();

    /**
     * Verfica os resultados que devem ser mostrados no mapa a partir da distancia do meu ponto
     */
    let data = [];
    for (let i in services) {
        // let distancia = getLatLngDistance(services[i].latitude, services[i].longitude, minhaLatlng.lat(), minhaLatlng.lng());
        // if (distancia < km)
        data.push(services[i]);
    }

    /**
     * Aplica filtro aos resultados que serão mostrados no mapa
     */
    servicesFiltered = profissionaisFiltrado(data);
    updateListService(servicesFiltered);
}

function initAutocomplete() {
    startMap();
}

$(function () {
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

    }).off("click", "#location-btn").on("click", "#location-btn", function () {
        let $loc = $("#location-box");
        if ($loc.hasClass("d-none")) {
            if (!$loc.hasClass("active")) {
                $loc.removeClass("d-none");
                setTimeout(function () {
                    $loc.addClass("active");
                }, 10);
            }
        } else if ($loc.hasClass("active")) {
            $loc.removeClass("active");
            setTimeout(function () {
                $loc.addClass("d-none");
            }, 250);
        }
    }).off("click", "#my-location-btn").on("click", "#my-location-btn", function () {
        $("#location-btn").trigger("click");
        if (navigator.geolocation) {
            navigator.permissions.query({name: 'geolocation'}).then(permissionGeo => {
                switch (permissionGeo.state) {
                    case "granted":
                    case "prompt":
                        navigator.geolocation.getCurrentPosition(position => {
                                myMarker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
                                moveToLocation(position.coords.latitude, position.coords.longitude);
                                readAllServices();
                            },
                            () => {
                                toast("Erro ao obter localização", 2000, "toast-warning");
                                readAllServices(1);
                            }, {
                                enableHighAccuracy: true,
                                timeout: 5000,
                                maximumAge: 0
                            });
                        break;
                    //exibe popup pedindo permissão para pegar localização
                    default:
                        //não aceitou mostrar a localização
                        toast("desinstale o app ou limpe os dados para poder localizar o GPS", 5000, "toast-warning");
                }
            });
        } else {
            toast("dispositivo sem suporte", 1500, "toast-warning");
        }

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
            $(".menu-swipe-class").addClass("open").removeClass("openFull close");

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

            db.exeRead("categorias").then(cat => {
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
});
