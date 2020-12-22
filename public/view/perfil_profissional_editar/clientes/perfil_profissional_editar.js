var imagem_de_perfil = [], galeria = [], profissional = null;

function getValoresCampos() {
    return {
        "nome_profissional": $("#nome").val(),
        "sobre": $("#sobre").val(),
        "imagem_de_perfil": imagem_de_perfil,
        "galeria": galeria,
        "distancia_de_atendimento_km": parseInt($("#distancia").val() || 0)
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
    imagem_de_perfil = profissional.imagem_de_perfil;
    galeria = profissional.galeria || [];

    $("#nome").val(profissional.nome_profissional);
    $("#sobre").val(profissional.sobre);
    $("#distancia").val(profissional.distancia_de_atendimento_km);

    if(!isEmpty(profissional.imagem_de_perfil))
        $("#imagem_de_perfil_preview").addClass("image").html("<img src='" + profissional.imagem_de_perfil[0].urls.thumb + "' alt='" + USER.nome + "' />");

    if (!isEmpty(profissional.galeria)) {
        for (let i in profissional.galeria)
            $("#galeria_preview > label[for='galeria']").after("<img src='" + profissional.galeria[i].urls.medium + "' alt='" + USER.nome + "' data-id='"+ i +"' />");
    }

    $("#imagem_de_perfil").off("change").on("change", async function (e) {
        if (typeof e.target.files[0] !== "undefined") {
            let image = await AJAX.uploadFile(e.target.files[0]);
            $("#imagem_de_perfil_preview").addClass("image").html("<img src='" + image.url + "' alt='" + image.nome + "' />");
            imagem_de_perfil = [];
            imagem_de_perfil.push(image);
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
        toast("Enviando...", 5000, "toast-infor");
        let result = await setUserData("perfil_profissional", [getValoresCampos()]);
        if(isNumberPositive(result)) {
            toast("Perfil Profissional Salvo!", 1400, "toast-success");
            pageTransition("perfil", "route", "back");
        } else if(!isEmpty(result.clientes)) {
            navigator.vibrate(100);
            for(let i in result.clientes)
                showErro($("#" + i), i + ": " + result.clientes[i]);
        }
    });

});