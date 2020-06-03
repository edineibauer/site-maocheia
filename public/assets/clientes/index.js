var
    filtrosProfissionais = {
        categoria: "",
        subcategoria: []
    },
    servicesOnMapUpdate = null,
    services = [],
    servicesFiltered = [],
    openService = {},
    myMarker,
    markers = [],
    markerCluster = null,
    map,
    mapMoveTrack,
    intervalPosition,
    touchElements;

function destruct() {
    clearInterval(servicesOnMapUpdate);
}

function readSubCategoriesMenu(categoria, selected) {
    let $sub = $("#subcategorias");
    db.exeRead("categorias_sub").then(cat => {
        let sub = cat.filter(c => c.categoria == categoria);
        $sub.htmlTemplate('subcategoriasMenu', {subcategorias: sub}).then(() => {

            if ($sub.hasClass("owl-loaded"))
                $sub.trigger('destroy.owl.carousel');

            $sub.owlCarousel({
                loop: false,
                margin: 10,
                dots: false,
                nav: false,
                responsive: {
                    0: {
                        items: 3.6,
                        startPosition: 0
                    }
                }
            });

            if(!isEmpty(sub)) {
                touchElements.setDistanciaStart(window.innerHeight - 122 - $sub.innerHeight() - (USER.setor === 0 ? 0 : 50));
                $("#subcategorias, #profissionais").removeClass("hideCategorie");
            } else {
                touchElements.setDistanciaStart(window.innerHeight - 125 - (USER.setor === 0 ? 0 : 50));
                $("#subcategorias, #profissionais").addClass("hideCategorie");
            }

            if (isNumberPositive(selected)) {
                $(".serviceAtuacao[rel='" + selected + "']").trigger("click");
            } else if(typeof selected === "object" && selected !== null && selected.constructor === Array) {
                for(let i in selected) {
                    if (isNumberPositive(selected[i]))
                        $(".serviceAtuacao[rel='" + selected[i] + "']").trigger("click");
                }
            }
        });
    });
}

function showCategoryAndSubcategory() {
    readSubCategoriesMenu(filtrosProfissionais.categoria, filtrosProfissionais.subcategoria);
    $("#subcategorias, #profissionais").removeClass("hideCategorie");
    touchElements.setDistanciaStart(window.innerHeight - 122 - $("#subcategorias").innerHeight() - (USER.setor === 0 ? 0 : 50));
}
db.exeRead("categorias");

function changeSwipeToSearch() {

    openService = {};
    let $menu = $(".menu-swipe-class");
    if (!$menu.hasClass("serviceFilterSearch")) {
        $menu.addClass("serviceFilterSearch").removeClass("servicePerfil buildPerfil");

        // resetMap();
        touchElements.setDistanciaTarget(87);

        if(isNumberPositive(filtrosProfissionais.categoria)) {
            showCategoryAndSubcategory();
        } else {
            touchElements.setDistanciaStart(window.innerHeight - 125 - (USER.setor === 0 ? 0 : 50));
        }

        $(".swipe-zone-body").addClass("filter");
        closeMapPopup();
        db.exeRead("categorias").then(categorias => {

            for (let c in categorias)
                categorias[c].selected = (!isEmpty(filtrosProfissionais.categoria) && categorias[c].id === filtrosProfissionais.categoria);

            $(".swipe-zone-body").htmlTemplate('serviceFilterSearch', {
                categorias: categorias
            }).then(() => {
                readServices();

                if(isNumberPositive(filtrosProfissionais.categoria))
                    showCategoryAndSubcategory();

                $('#categorias').owlCarousel({
                    loop: false,
                    margin: 10,
                    dots: false,
                    nav: false,
                    responsive: {
                        0: {
                            items: 5.6,
                            startPosition: 0
                        }
                    }
                });
            });
        });
    }
}

function changeSwipeToService(data) {
    openService = data;
    $(".menu-swipe-class").addClass("servicePerfil").removeClass("serviceFilterSearch buildPerfil");

    touchElements.setDistanciaTarget(0).setDistanciaStart(window.innerHeight - 255 - (USER.setor === 0 ? 0 : 50));

    $(".swipe-zone-body").removeClass("filter").htmlTemplate('servicePerfil', data).then(() => {

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
                touchElements.moveToStart();
            } else {
                changeSwipeToSearch();
                touchElements.moveToTarget();
            }
        });

        $("#imagem-perfil, h2.nome").off("click").on("click", function () {
            touchOpenPerfil();
        });
    });
}

/*function getLogradouroFromEndereco(endereco) {
    return endereco.rua + " - " + endereco.bairro + ", " + endereco.cidade + " - " + endereco.estado + ", " + endereco.cep + ", " + endereco.pais;
}*/

function touchOpenPerfil() {
    let state = history.state;
    state.param = Object.assign(state.param || {}, {service: openService});
    history.replaceState(state, null, HOME + state.route);
    touchElements.moveToTarget();
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

    $(".menu-swipe-class").addClass("open").removeClass("touchOpen close");
    $("#procura").blur();
    let myService = services.filter(s => s.id === this.id);
    changeSwipeToService(myService[0]);
    openMapPopup(this);
}

function profissionaisFiltrado(data) {
    let list = [];
    for (let p of data) {
        let pass = !0;
        for (let c in filtrosProfissionais) {
            if (c === "categoria" && !isEmpty(filtrosProfissionais[c]) && filtrosProfissionais[c] !== parseInt(p.perfil_profissional.categoria))
                pass = !1;
            else if (c === "subcategoria" && !isEmpty(filtrosProfissionais[c]) && (isEmpty(p.perfil_profissional.subcategorias) || filtrosProfissionais[c].length !== filtrosProfissionais[c].filter(element => p.perfil_profissional.subcategorias.includes(element)).length))
                pass = !1;
        }

        if (pass && p.perfil_profissional.ativo)
            list.push(p);
    }

    return list;
}

function getAllServiceOnMap() {
    let $imgs = [];
    $("#mapa-home").find(".gm-style-pbc").next().find("img").each(function(i, e) {
        if(/i=service/i.test($(e).attr("src")))
            $imgs.push($(e));
    });
    return $imgs;
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
    for (let i = 0; i < data.length; i++) {
        if(data[i].perfil_profissional?.ativo == 1)
            addMarker(data[i], 2, parseFloat(data[i].latitude), parseFloat(data[i].longitude));
    }
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
            db.exeRead("categorias_sub").then(subcategorias => {
                services = [];
                for (let i in result)
                    services.push(getProfissionalMustache(result[i], categories.find(s => s.id == result[i].perfil_profissional.categoria), subcategorias));

                readServices();

                if (navigator.onLine && USER.setor !== 0) {
                    clearInterval(servicesOnMapUpdate);
                    servicesOnMapUpdate = setInterval(function () {
                        updateRealPosition();
                    }, 4000);
                }
            });
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
                for (let result of results) {
                    for (let service of services) {
                        if (service.id === result.cliente) {
                            /**
                             * Atualiza lat, e lng
                             * Atualiza distancia também
                             */
                            service.latitude = result.latitude;
                            service.longitude = result.longitude;
                            service.data_de_atualizacao = result.data_de_atualizacao;
                            service.distancia = getLatLngDistance(service.latitude, service.longitude, minhaLatlng.lat(), minhaLatlng.lng());
                            if(isNumberPositive(service.distancia_de_atendimento_km) && service.distancia_de_atendimento_km < service.distancia)
                                service.ativo = !1;

                            /**
                             * Atualiza posição dos markers no mapa
                             */
                            if (!isEmpty(markers)) {
                                for (let m of markers) {
                                    if (m?.id === service?.id) {
                                        m.setPosition(new google.maps.LatLng(parseFloat(service.latitude), parseFloat(service.longitude)));
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
    /**
     * Aplica filtro aos resultados que serão mostrados no mapa
     */
    servicesFiltered = profissionaisFiltrado(services)
    updateListService(servicesFiltered);
    setAllServicesOnMap(servicesFiltered);
}

function initAutocomplete() {
    startMap();
}

function getRealPosition() {
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
}

$(function () {
    /**
     * Primeiro carregamento do mapa
     */
    if (navigator.onLine)
        $.cachedScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDOHzDqP5Obg3nqWwu-QwztEyhD8XENPGE&libraries=places,directions&callback=initAutocomplete&language=pt-br");
    else
        initAutocomplete();

    $("body").off("click", "#location-btn").on("click", "#location-btn", function () {

        /**
         * Set default menu
         */
        touchElements.moveToStart();
        changeSwipeToSearch();

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
        getRealPosition();

    }).off("click", ".profissional").on("click", ".profissional", function () {
        for (let i in services) {
            if (services[i].id === $(this).attr("rel")) {
                changeSwipeToService(services[i]);
                touchOpenPerfil();
                break;
            }
        }
    }).off("focus", "#procura").on("focus", "#procura", function () {
        changeSwipeToSearch();

        $(".swipe-zone-body").addClass("hideFilter");
        $(".titulo-result").html("Resultados da pesquisa");

        /**
         * Reseta categorias e subcategorias seleção
         */
        $("#subcategorias, #profissionais").addClass("hideCategorie");
        $(".serviceCategory").removeClass("selecionado");
        filtrosProfissionais.subcategoria = [];
        filtrosProfissionais.categoria = "";
        touchElements.setDistanciaStart(window.innerHeight - 125 - (USER.setor === 0 ? 0 : 50));
        touchElements.moveToTarget();

        $("#procura").one("blur", function () {
            let search = $(this).val();
            setTimeout(function () {
                $(".swipe-zone-body").removeClass("hideFilter");
                $(".titulo-result").html("Profissionais");
                if (search.length) {
                    $("#procura").val("");
                }
            }, 100);

        }).off("keyup").on("keyup", function (e) {
            let search = $(this).val().toLowerCase();

            if(e.keyCode === 13) {
                $("#services").find(".cardList").first().trigger("click");
                $("#procura").trigger("blur");
            } else {

                let results = [];
                for (let i in services) {
                    let service = services[i];
                    service.isService = !0;
                    service.isSubCategory = !1;
                    results.push(service);
                }

                db.exeRead("categorias").then(cat => {
                    for (let c in cat) {
                        cat[c].isService = !1;
                        cat[c].isSubCategory = !1;
                        results.push(cat[c]);
                    }

                    db.exeRead("categorias_sub").then(subCat => {
                        for (let c in subCat) {
                            subCat[c].isService = !1;
                            subCat[c].isSubCategory = !0;
                            results.push(subCat[c]);
                        }

                        $("#services").htmlTemplate("resultSearch", {results: results.filter(s => s.nome.toLowerCase().indexOf(search) > -1)}, ['serviceCard', 'serviceCategoryCard']);
                    });
                });
            }

        })
    }).off("click", ".serviceAtuacao").on("click", ".serviceAtuacao", function () {

        /**
         * Click on subcategory
         */
        let id = $(this).attr('rel');
        if ($(this).hasClass("selecionado")) {
            filtrosProfissionais.subcategoria = removeItemArray(filtrosProfissionais.subcategoria, id);
            $(this).removeClass("selecionado");
        } else {
            if(filtrosProfissionais.subcategoria.indexOf(id) === -1)
                filtrosProfissionais.subcategoria.push(id);

            $(this).addClass("selecionado");
        }
        readServices();

    }).off("click", ".serviceProfissao").on("click", ".serviceProfissao", function () {
        selectCategory($(this).attr('rel'));

    }).off("click", ".serviceCategoryResult").on("click", ".serviceCategoryResult", function () {
        selectCategory($(this).attr('rel'), 999999999);

    }).off("click", ".serviceSubCategoryResult").on("click", ".serviceSubCategoryResult", function () {
        let id = $(this).attr("rel");
        db.exeRead("categorias_sub", id).then(sub => {
            selectCategory(sub.categoria, id);
        });
    }).off("click", ".contato").on("click", ".contato", function () {
        post("site-maocheia", "descontaMoeda");
    });
});

function selectCategory(category, subcategory) {
    category = parseInt(category);
    filtrosProfissionais.subcategoria = [];
    if (filtrosProfissionais.categoria === category) {
        if(!isNumberPositive(subcategory)) {
            touchElements.setDistanciaStart(window.innerHeight - 125 - (USER.setor === 0 ? 0 : 50));
            filtrosProfissionais.categoria = "";
            $(".serviceProfissao").removeClass("selecionado");
            $("#subcategorias, #profissionais").addClass("hideCategorie");
        }
    } else {
        filtrosProfissionais.categoria = category;
        $(".serviceProfissao").removeClass("selecionado");
        $(".serviceProfissao[rel='" + category + "']").addClass("selecionado");
    }

    readSubCategoriesMenu(filtrosProfissionais.categoria, subcategory);
    setTimeout(function () {
        readServices();
    }, 150);
}
