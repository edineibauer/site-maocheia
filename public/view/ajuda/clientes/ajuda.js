$(function () {
    (async () => {

        let ajuda = await db.exeRead("ajuda");

        if(!isEmpty(ajuda)) {
            $("#ajudas").htmlTemplate('ajudas', {ajudas: ajuda})
        } else {
            $("#ajudas").htmlTemplate('empty', {text: "Nenhuma ajuda cadastrada"});
        }

        $("#app").off("click", ".ajudatitulo").on("click", ".ajudatitulo", function () {
            let $textoDiv = $(".ajudatextodiv[rel='" + $(this).attr("rel") + "']");
            if($textoDiv.hasClass("active")) {
                $textoDiv.removeClass("active").css("height", 0);
            } else {
                let $texto = $(".ajudatexto[rel='" + $(this).attr("rel") + "']");
                $textoDiv.addClass("active").css("height", $texto.height() + 20 + "px");
            }
        });

    })();
});