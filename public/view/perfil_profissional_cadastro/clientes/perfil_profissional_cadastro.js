var imagem_de_perfil = [], imagem_de_fundo = [], galeria = [];

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

if(!isEmpty(USER.setorData.perfil_profissional))
    pageTransition("perfil_profissional_editar");

$(function () {
    db.exeRead("categorias").then(categorias => {
        $("#categoria").html("<option disabled='disabled' selected='selected' value=''>Selecione...</option>");
        for (let i in categorias)
            $("#categoria").append("<option value='" + categorias[i].id + "'>" + categorias[i].nome + "</option>");

        $("#categoria").off("change").on("change", function() {
            readSubCategories($(this).val(), []);
        });
    });

    $("#app").off("keyup change", ".form-control").on("keyup change", ".form-control", function () {
        $(this).css("border-bottom-color", "#CECECE").siblings("label").css("color", "#707070");

    }).off("click", "#galeria_preview>img").on("click", "#galeria_preview>img", function () {
        let $this = $(this);
        let id = $this.data("id");
        if(confirm("remover imagem?")) {
            galeria = $.grep(galeria, e => {
                return e.name !== id;
            });
            $this.remove();
        }
    });

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
                $("#galeria_preview > label[for='galeria']").after("<img src='" + image.url + "' data-id='" + image.name + "' alt='" + image.nome + "' />");
                galeria.push(image);
            }
        }
    });

    $("#create-profissional").off("click").on("click", function () {

        toast("Enviando dados...", 13000, "toast-infor");
        let subcategorias = [];
        $(".subcategorias:checked").each(function(i, e) {
            subcategorias.push($(e).attr("id"));
        });

        let dias = [];
        $(".dias").each(function(i, e) {
            if($(e).is(":checked"))
                dias.push($(e).attr("id"));
        });

        let profissional = {
            "profissional_id": "",
            "categoria": $("#categoria").val(),
            "subcategorias": subcategorias,
            "sobre": $("#sobre").val(),
            "imagem_de_perfil": imagem_de_perfil,
            "imagem_de_fundo": imagem_de_fundo,
            "galeria": galeria,
            "inicio": $("#inicio").val(),
            "termino": $("#termino").val(),
            "dias": JSON.stringify(dias),
            "whatsapp": $("#whatsapp").val(),
            "telefone": $("#telefone").val(),
            "email": $("#email").val(),
            "site": $("#site").val(),
            "distancia_de_atendimento_km": parseInt($("#distancia").val() || 0),
            "ativo": !0,
        };

        if (isEmpty(profissional.imagem_de_perfil)) {
            showErro($("#imagem_de_perfil"), "Defina uma imagem de perfil");
        } else if (isEmpty(profissional.imagem_de_fundo)) {
            showErro($("#imagem_de_fundo"), "Defina uma imagem de fundo");
        } else if (isEmpty(profissional.categoria)) {
            showErro($("#categoria"), "informe sua categoria");
        } else if (isEmpty(profissional.inicio)) {
            showErro($("#inicio"), "Informe a hora que começa a trabalhar");
        } else if (isEmpty(profissional.termino)) {
            showErro($("#termino"), "Informe a hora que termina de trabalhar");
        } else if (isEmpty(profissional.sobre)) {
            showErro($("#sobre"), "Descreva seu trabalho");
        } else if (isEmpty(profissional.whatsapp) || profissional.whatsapp.length < 10) {
            showErro($("#whatsapp"), "Informe seu Whatsapp");
        } else {

            profissional.id = Date.now() + Math.floor((Math.random() * 1000) + 1);
            profissional.formIdentificador = Date.now() + Math.floor((Math.random() * 1000) + 1);
            profissional.columnTituloExtend = "<small class='color-gray left opacity padding-tiny radius'>categoria</small><span style='padding: 1px 5px' class='left padding-right font-medium td-title'> " + $("#categoria :selected").text() + "</span>";
            profissional.columnName = "perfil_profissional";
            profissional.columnRelation = "profissional";
            profissional.columnStatus = {column: "", have: "false", value: "false"};

            db.exeCreate("clientes", {id: USER.setorData.id, perfil_profissional: [profissional]}).then(r => {
                if(r.response === 1) {
                    toast("Parabéns! Perfil criado!", 3000, "toast-success");
                    pageTransition("perfil");
                } else {
                    navigator.vibrate(100);
                    for(let i in r.data.clientes)
                        showErro($("#" + i), i + ": " + r.data.clientes[i]);
                }
            });
        }
    });
});