async function btnPrimary() {
    let $btn = $("#serviceMensagem");
    if (window.getComputedStyle($("#serviceMensagem")[0], ':before').content.replace('"', "").replace('"', "").trim() === "VER PERFIL") {
        touchOpenPerfil();
    } else {
        if (!isNumberPositive($btn.data("rel"))) {
            toast("Usuário inválido", 1400, "toast-infor");
        } else {
            let id = $btn.data("rel");
            let messages = await db.exeRead("messages_user", {usuario: id});
            pageTransition("message/" + id, "route", "forward", null, (!isEmpty(messages) ? messages[0] : []));
        }
    }
}

async function readSubCategoriesMenu(categoria, selected) {
    let $sub = $("#subcategorias");
    let cat = await db.exeRead("categorias_sub");
    let tpl = await getTemplates();
    let sub = cat.filter(c => c.categoria == categoria);
    await $sub.html(Mustache.render(tpl.subcategoriasMenu, {subcategorias: sub}));

    if ($sub.hasClass("owl-loaded"))
        $sub.trigger('destroy.owl.carousel');

    $sub.owlCarousel({
        loop: false,
        margin: 10,
        dots: false,
        nav: false,
        responsive: {
            0: {
                items: 4,
                startPosition: 0
            }
        }
    });

    if (!isEmpty(sub)) {
        touchElements.setDistanciaStart(window.innerHeight - 122 - $sub.innerHeight() - (USER.setor === 0 ? 0 : 50));
        $("#subcategorias, #profissionais").removeClass("hideCategorie");
    } else {
        touchElements.setDistanciaStart(window.innerHeight - 125 - (USER.setor === 0 ? 0 : 50));
        $("#subcategorias, #profissionais").addClass("hideCategorie");
    }

    if (isNumberPositive(selected)) {
        $(".serviceAtuacao[rel='" + selected + "']").trigger("click");
    } else if (typeof selected === "object" && selected !== null && selected.constructor === Array) {
        for (let i in selected) {
            if (isNumberPositive(selected[i]))
                $(".serviceAtuacao[rel='" + selected[i] + "']").trigger("click");
        }
    }
}

function showCategoryAndSubcategory() {
    readSubCategoriesMenu(filtrosProfissionais.categoria, filtrosProfissionais.subcategoria);
    $("#subcategorias, #profissionais").removeClass("hideCategorie");
    touchElements.setDistanciaStart(window.innerHeight - 122 - $("#subcategorias").innerHeight() - (USER.setor === 0 ? 0 : 50));
}

db.exeRead("categorias");

async function changeSwipeToSearch() {
    updateListService();

    openService = {};
    let $menu = $(".menu-swipe-class");
    if (!$menu.hasClass("serviceFilterSearch")) {
        $menu.addClass("serviceFilterSearch").removeClass("servicePerfil buildPerfil");

        // resetMap();
        touchElements.setDistanciaTarget(87);

        if (isNumberPositive(filtrosProfissionais.categoria)) {
            showCategoryAndSubcategory();
        } else {
            touchElements.setDistanciaStart(window.innerHeight - 125 - (USER.setor === 0 ? 0 : 50));
        }

        $(".swipe-zone-body").addClass("filter");
        closeMapPopup();
        let categorias = await db.exeRead("categorias");

        for (let c in categorias)
            categorias[c].selected = (!isEmpty(filtrosProfissionais.categoria) && categorias[c].id === filtrosProfissionais.categoria);

        let tpl = await getTemplates();
        $(".swipe-zone-body").html(Mustache.render(tpl.serviceFilterSearch, categorias));

        if (isNumberPositive(filtrosProfissionais.categoria))
            showCategoryAndSubcategory();

        $('#categorias').owlCarousel({
            loop: false,
            margin: 10,
            dots: false,
            nav: false,
            responsive: {
                0: {
                    items: 5,
                    startPosition: 0
                }
            }
        });
    }
}

async function changeSwipeToService(data) {
    openService = data;
    $(".menu-swipe-class").addClass("servicePerfil").removeClass("serviceFilterSearch buildPerfil");

    touchElements.setDistanciaTarget(0).setDistanciaStart(window.innerHeight - 255 - (USER.setor === 0 ? 0 : 50));

    let tpl = await getTemplates();
    await $(".swipe-zone-body").removeClass("filter").html(Mustache.render(tpl.servicePerfil, data));

    /**
     * Read avaliações
     */
    getJSON(HOME + "app/find/avaliacao/profissional/" + data.id).then(avaliacoes => {
        let feedbacks = [];
        if (avaliacoes.response === 1 && !isEmpty(avaliacoes.data) && !isEmpty(avaliacoes.data.avaliacao)) {

            if (avaliacoes.data.avaliacao.length > 5)
                $("#section-avaliacoes-more").removeClass("hide");

            for (let aval of avaliacoes.data.avaliacao.slice(0, 5)) {
                // aval.imagens = (!isEmpty(aval.imagens) ? JSON.parse(aval.imagens) : []);
                aval.data = moment(aval.data).format("DD/MM/YYYY");
                aval.imagem_do_cliente = (!isEmpty(aval.imagem_do_cliente) ? aval.imagem_do_cliente : HOME + "assetsPublic/img/favicon.png?v=" + VERSION);
                aval.avaliacao_geral = (((!isEmpty(aval.atendimento) ? parseInt(aval.atendimento) : 10000000) + (!isEmpty(aval.qualidade) ? parseInt(aval.qualidade) : 10000000)) / 2);
                aval.star = getProfissionalStar(aval.avaliacao_geral);
                feedbacks.push(aval);
            }
            if (avaliacoes.data.avaliacao.length > 5)
                $("#section-avaliacoes-more").removeClass("hide");

            $("#section-avaliacoes-title").html("Avaliações");
        }

        if (!isEmpty(feedbacks))
            $("#section-avaliacoes").html(Mustache.render(tpl.avaliacoes, feedbacks));
        else
            $("#section-avaliacoes").html('');
    });

    $("#imagem-perfil, h2.nome").off("click").on("click", function () {
        touchOpenPerfil();
    });
}

function backHomeService() {
    let pass = !1;
    for (let i in markers) {
        if (/serviceSelected$/.test(markers[i].icon.url)) {
            pass = !0;
            break;
        }
    }

    if (pass) {
        if (touchElements.$el.hasClass("touchOpen")) {
            touchElements.moveToStart();
        } else {
            touchElements.setDistanciaStart(window.innerHeight - 125 - (USER.setor === 0 ? 0 : 50));
            changeSwipeToSearch();
        }
    } else {
        changeSwipeToSearch();
        touchElements.moveToTarget();
    }
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

function getServicesFiltered() {
    let list = [];
    for (let p of services) {
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
    $("#mapa-home").find(".gm-style-pbc").next().find("img").each(function (i, e) {
        if (/i=service/i.test($(e).attr("src")))
            $imgs.push($(e));
    });
    return $imgs;
}

async function updateListService() {
    let tpl = await getTemplates();
    $("#services").html(Mustache.render(tpl.serviceCards, {profissionais: servicesOnMap}, tpl));
}

/**
 * Atualiza lista e mapa com os serviços dentro da distância e dos filtros selecionados
 */
var showingServices = !1;

async function showServices() {
    while (showingServices)
        await sleep(50);

    /**
     * @array servicos => Lista com novos serviços no mapa
     * @array servicesOnMap => Lista com antigos serviços no mapa
     */
    showingServices = !0;
    let servicos = getServicesFiltered();

    if (!isEmpty(servicos)) {
        for (let i in servicos) {
            let service = servicesOnMap.find(e => e.id == servicos[i].id);

            if (service)
                updateService(service, servicos[i]);
            else
                addService(servicos[i]);
        }

        /**
         * Remove services from the list
         */
        if (!isEmpty(servicesOnMap)) {
            for (let i in servicesOnMap.reverse()) {
                if (!servicos.find(e => e.id == servicesOnMap[i].id))
                    servicesOnMap.splice(i, 1);
            }
        }

        /**
         * Remove all markers not on servicesOnMap
         */
        if (!isEmpty(markers)) {
            for (let i in markers) {
                if (typeof markers[i] === "object" && !servicos.find(e => e.id == markers[i].service.id)) {
                    markers[i].setMap(null);
                    delete (markers[i]);
                }
            }
        }

        servicesOnMap = servicos;

    } else if (!isEmpty(servicesOnMap)) {
        /**
         * Remove all services from map
         */
        for (let e in markers) {
            markers[e].setMap(null);
            delete (markers[e]);
        }
        servicesOnMap = [];
    }

    if (!$("#procura").is(":focus"))
        await updateListService();

    showingServices = !1;
}

$(function () {
    /**
     * Primeiro carregamento do mapa
     */
    if (!map)
        $.cachedScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDOHzDqP5Obg3nqWwu-QwztEyhD8XENPGE&libraries=places,directions&callback=startMap&language=pt-br");
    else
        startMap();

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
        moveToLocation(USER.setorData.latitude, USER.setorData.longitude);

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
            showServices();
            let search = $(this).val();
            $(".swipe-zone-body").removeClass("hideFilter");
            $(".titulo-result").html("Profissionais");
            if (search.length) {
                $("#procura").val("");
            }

        }).off("keyup").on("keyup", async function (e) {
            let search = $(this).val().toLowerCase();

            if (e.keyCode === 13) {
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

                let cat = await db.exeRead("categorias");
                for (let c in cat) {
                    cat[c].isService = !1;
                    cat[c].isSubCategory = !1;
                    results.push(cat[c]);
                }

                let subCat = await db.exeRead("categorias_sub");
                for (let c in subCat) {
                    subCat[c].isService = !1;
                    subCat[c].isSubCategory = !0;
                    results.push(subCat[c]);
                }
                let tpl = await getTemplates();
                $("#services").html(Mustache.render(tpl.resultSearch, {results: results.filter(s => s.nome.toLowerCase().indexOf(search) > -1)}, tpl));
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
            if (filtrosProfissionais.subcategoria.indexOf(id) === -1)
                filtrosProfissionais.subcategoria.push(id);

            $(this).addClass("selecionado");
        }
        showServices();

    }).off("click", ".serviceProfissao").on("click", ".serviceProfissao", function () {
        selectCategory($(this).attr('rel'));

    }).off("click", ".serviceCategoryResult").on("click", ".serviceCategoryResult", function () {
        selectCategory($(this).attr('rel'), 999999999);
        touchElements.moveToStart();

    }).off("click", ".serviceSubCategoryResult").on("click", ".serviceSubCategoryResult", function () {
        let id = $(this).attr("rel");
        db.exeRead("categorias_sub", id).then(sub => {
            if (!isEmpty(sub))
                selectCategory(sub[0].categoria, id);
        });
        touchElements.moveToStart();
    }).off("click", ".contato").on("click", ".contato", function () {
        post("site-maocheia", "descontaMoeda", {profissional: $(this).data("id"), canal: $(this).data("canal")});
    });
});

function selectCategory(category, subcategory) {
    category = parseInt(category);
    filtrosProfissionais.subcategoria = [];
    if (filtrosProfissionais.categoria === category) {
        if (!isNumberPositive(subcategory)) {
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
        showServices();
    }, 150);
}
