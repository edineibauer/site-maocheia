var imagem_de_perfil = [], imagem_de_fundo = [], galeria = [], profissional = null;

async function readSubCategories(categoria, subcategorias) {
    let cat = await db.exeRead("categorias_sub");
    let sub = [];
    for(let i in cat) {
        if(cat[i].categoria == categoria) {
            cat[i].checked = subcategorias.indexOf(cat[i].id.toString()) > -1;
            sub.push(cat[i]);
        }
    }
    if(!isEmpty(sub))
        $("#areasatuacao").removeClass("hide");
    else
        $("#areasatuacao").addClass("hide");

    $("#subcategorias").htmlTemplate('subcategorias', {categorias: sub});
}

function getValoresCampos() {
    let subcategorias = [];
    $(".subcategorias:checked").each(function(i, e) {
        subcategorias.push($(e).attr("id"));
    });

    let dias = [];
    $(".dias").each(function(i, e) {
        if($(e).is(":checked"))
            dias.push($(e).attr("id"));
    });

    return {
        "profissional_id": isNumberPositive(profissional.profissional_id) ? profissional.profissional_id : "",
        "categoria": $("#categoria").val(),
        "subcategorias": subcategorias,
        "sobre": $("#sobre").val(),
        "imagem_de_perfil": imagem_de_perfil,
        "imagem_de_fundo": imagem_de_fundo,
        "galeria": galeria,
        "inicio": $("#inicio").val(),
        "termino": $("#termino").val(),
        // "whatsapp": $("#whatsapp").val(),
        // "telefone": $("#telefone").val(),
        // "email": $("#email").val(),
        // "site": $("#site").val(),
        "dias": JSON.stringify(dias),
        "distancia_de_atendimento_km": parseInt($("#distancia").val() || 0),
        "ativo": !0,
    };
}

function showErro($element, mensagem) {
    $('html,body').animate({ scrollTop: $element.offset().top - 100}, 'slow');
    toast(mensagem, 2500, "toast-warning");
    if($element.hasClass("carregar-foto")) {
        $element = $element.siblings(".Neon").find("label[for='" + $element.attr("id") + "']");
        $element.css("border-color", "red");
        setTimeout(function () {
            $element.css("border-color", "#CECECE");
        }, 2000);
    } else {
        $element.css("border-bottom-color", "red").siblings("label").css("color", "red");
    }
}

if(isEmpty(USER.setorData.perfil_profissional))
    pageTransition("perfil_profissional_cadastro");

$(async function () {
    profissional = USER.setorData.perfil_profissional[0];
    profissional.categoria = parseInt(profissional.categoria);
    profissional.dias = (!isEmpty(profissional.dias) ? JSON.parse(profissional.dias) : []);

    let categorias = await db.exeRead("categorias");
    $("#categoria").html("");
    if (!isEmpty(categorias)) {
        for (let i in categorias)
            $("#categoria").append("<option value='" + categorias[i].id + "'" + (profissional.categoria === categorias[i].id ? " selected='selected'" : "") + ">" + categorias[i].nome + "</option>");
    }

    readSubCategories(profissional.categoria, profissional.subcategorias || []);
    $("#categoria").off("change").on("change", function() {
        readSubCategories($(this).val(), []);
    });

    imagem_de_perfil = profissional.imagem_de_perfil;
    imagem_de_fundo = profissional.imagem_de_fundo;
    galeria = profissional.galeria || [];

    $("#sobre").val(profissional.sobre);
    $("#imagem_de_perfil_preview").addClass("image").html("<img src='" + profissional.imagem_de_perfil[0].urls.thumb + "' alt='" + USER.nome + "' />");
    $("#imagem_de_fundo_preview").addClass("image").html("<img src='" + profissional.imagem_de_fundo[0].urls.medium + "' alt='" + USER.nome + "' />");
    $("#inicio").val(profissional.inicio);
    $("#termino").val(profissional.termino);
    $("#whatsapp").val(profissional.whatsapp);
    $("#telefone").val(profissional.telefone);
    $("#email").val(profissional.email);
    $("#site").val(profissional.site);
    $("#distancia").val(profissional.distancia_de_atendimento_km);
    for(let dia of profissional.dias)
        $("#" + dia).prop("checked", !0);

    if (!isEmpty(profissional.galeria)) {
        for (let i in profissional.galeria)
            $("#galeria_preview > label[for='galeria']").after("<img src='" + profissional.galeria[i].urls.medium + "' alt='" + USER.nome + "' data-id='"+ i +"' />");
    }

    $("#imagem_de_perfil").off("change").on("change", async function (e) {
        if (typeof e.target.files[0] !== "undefined") {
            let image = await AJAX.uploadFile(e.target.files[0]);
            imagem_de_perfil = [];

            $("#imagem_de_perfil_preview").addClass("image").html("<img src='" + image.url + "' alt='" + image.nome + "' />");
            imagem_de_perfil.push(image);
        }
    });

    $("#imagem_de_fundo").off("change").on("change", async function (e) {
        if (typeof e.target.files[0] !== "undefined") {
            let image = await AJAX.uploadFile(e.target.files[0]);
            imagem_de_fundo = [];

            $("#imagem_de_fundo_preview").addClass("image").html("<img src='" + image.url + "' alt='" + image.nome + "' />");
            imagem_de_fundo.push(image);
        }
    });

    $("#galeria").off("change").on("change", async function (e) {
        if (typeof e.target.files[0] !== "undefined") {
            let images = await AJAX.uploadFile(e.target.files);
            for(let image of images) {
                $("#galeria_preview > label[for='galeria']").after("<img src='" + image.url + "' class='galone' data-id='" + image.name + "' alt='" + image.nome + "' />");
                galeria.push(image);
            }
        }
    });

    $("#app").off("click", "#galeria_preview > .galone").on("click", "#galeria_preview > .galone", function () {
        let $this = $(this);
        let id = $this.data("id");
        if(confirm("remover imagem?")) {
            galeria = $.grep(galeria, e => {
                return e.name !== id;
            });
            $this.remove();
        }
    });

    $("#update-profissional").off("click").on("click", async function () {
        let p = getValoresCampos();


        if (isEmpty(p.imagem_de_perfil)) {
            showErro($("#imagem_de_perfil"), "Defina uma imagem de perfil");
        } else if (isEmpty(p.imagem_de_fundo)) {
            showErro($("#imagem_de_fundo"), "Defina uma imagem de fundo");
        } else if (isEmpty(p.categoria)) {
            showErro($("#categoria"), "informe sua categoria");
        } else if (isEmpty(p.inicio)) {
            showErro($("#inicio"), "Informe a hora que começa a trabalhar");
        } else if (isEmpty(p.termino)) {
            showErro($("#termino"), "Informe a hora que termina de trabalhar");
        } else if (isEmpty(p.sobre)) {
            showErro($("#sobre"), "Descreva seu trabalho");
        // } else if (isEmpty(p.whatsapp) || p.whatsapp.length < 10) {
        //     showErro($("#whatsapp"), "Informe seu Whatsapp");
        } else {
            let result = await setUserData("perfil_profissional", [p]);
            if(isNumberPositive(result)) {
                toast("Perfil Profissional Salvo!", 1400, "toast-success");
                pageTransition("perfil", "route", "back");
            } else if(!isEmpty(result.clientes)) {
                navigator.vibrate(100);
                for(let i in result.clientes)
                    showErro($("#" + i), i + ": " + result.clientes[i]);
            }
        }
    });

});