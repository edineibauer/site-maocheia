$("#core-loader").css("display", "block");
$(function () {
    db.exeRead("avaliacoes").then(avaliacoes => {
        $("#core-loader").css("display", "none");
        if(!isEmpty(avaliacoes)) {
            $("#avaliacoes-body").htmlTemplate('avaliacoes', avaliacoes)
        } else {
            $("#avaliacoes-body > .hide").removeClass("hide");
        }
    });
});