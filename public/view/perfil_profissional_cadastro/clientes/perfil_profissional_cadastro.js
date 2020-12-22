var imagem_de_perfil = [], galeria = [];

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
    $("#app").off("keyup change", ".form-control").on("keyup change", ".form-control", function () {
        $(this).css("border-bottom-color", "#CECECE").siblings("label").css("color", "#707070");

    }).off("click", "#galeria_preview > .galone").on("click", "#galeria_preview > .galone", function () {
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
                $("#galeria_preview > label[for='galeria']").after("<img src='" + image.url + "' class='galone' data-id='" + image.name + "' alt='" + image.nome + "' />");
                galeria.push(image);
            }
        }
    });

    $("#create-profissional").off("click").on("click", async function () {

        toast("Enviando dados...", 13000, "toast-infor");

        let dias = [];
        $(".dias").each(function(i, e) {
            if($(e).is(":checked"))
                dias.push($(e).attr("id"));
        });

        let profissional = {
            "nome_profissional": $("#nome").val(),
            "sobre": $("#sobre").val(),
            "imagem_de_perfil": imagem_de_perfil,
            "galeria": galeria,
            "distancia_de_atendimento_km": parseInt($("#distancia").val() || 0)
        };

        profissional.id = Date.now() + Math.floor((Math.random() * 1000) + 1);
        profissional.formIdentificador = Date.now() + Math.floor((Math.random() * 1000) + 1);
        profissional.columnTituloExtend = "<small class='color-gray left opacity padding-tiny radius'>categoria</small><span style='padding: 1px 5px' class='left padding-right font-medium td-title'> " + $("#categoria :selected").text() + "</span>";
        profissional.columnName = "perfil_profissional";
        profissional.columnRelation = "profissional";
        profissional.columnStatus = {column: "", have: "false", value: "false"};

        let result = await setUserData("perfil_profissional", [profissional]);
        if(isNumberPositive(result)) {
            toast("Perfil salvo!", 2000, "toast-success");
            setTimeout(function () {
                pageTransition("howitwork");
            }, 1000);
        } else if(!isEmpty(result.clientes)) {
            navigator.vibrate(100);
            for(let i in result.clientes)
                showErro($("#" + i), i + ": " + result.clientes[i]);
        }
    });
});